import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@/lib/supabase/server";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) return null;

        // 프로필 조회
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        return {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.nickname || data.user.email,
          image: profile?.avatar_url,
          userType: profile?.user_type || "job_seeker",
          status: profile?.status || "active",
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // 소셜 로그인 시 Supabase에 사용자 동기화
      if (account?.provider && account.provider !== "credentials") {
        const supabase = createClient();

        // 기존 프로필 확인
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", user.email!)
          .single();

        if (!existingProfile) {
          // Supabase Auth로 사용자 생성 (소셜 로그인 연동)
          const { data: authData, error: authError } = await supabase.auth.admin?.createUser({
            email: user.email!,
            email_confirm: true,
            user_metadata: {
              nickname: user.name || "",
              avatar_url: user.image || "",
              provider: account.provider,
            },
          }) ?? { data: null, error: null };

          if (authError || !authData?.user) {
            // admin API가 없는 경우 (클라이언트 사이드),
            // signUp으로 fallback
            const { error: signUpError } = await supabase.auth.signUp({
              email: user.email!,
              password: crypto.randomUUID(),
              options: {
                data: {
                  nickname: user.name || "",
                  avatar_url: user.image || "",
                  provider: account.provider,
                },
              },
            });
            if (signUpError) {
              console.error("Social sign up error:", signUpError);
            }
          }
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userType = (user as unknown as Record<string, unknown>).userType as string;
        token.status = (user as unknown as Record<string, unknown>).status as string;
      }

      // 세션 업데이트 요청 시 DB에서 최신 정보 갱신
      if (trigger === "update" && session) {
        token.userType = session.userType;
        token.status = session.status;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.userType = token.userType as string;
        session.user.status = token.status as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    newUser: "/signup",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
