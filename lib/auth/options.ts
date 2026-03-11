import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAdminClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { updateLoginStreak } from "@/lib/achievements/checker";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const supabase = createAdminClient();

        // users 테이블에서 조회
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (!user || !user.password_hash) return null;

        // bcrypt로 비밀번호 검증
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.user_type || null,
          status: user.status || "active",
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "kakao") {
        const supabase = createAdminClient();

        // 기존 사용자 확인
        const { data: existingUser } = await supabase
          .from("users")
          .select("id, user_type, status")
          .eq("email", user.email!)
          .single();

        if (!existingUser) {
          // 신규 사용자 생성 (user_type은 NULL → 온보딩 페이지에서 선택)
          const { data: newUser, error } = await supabase
            .from("users")
            .insert({
              email: user.email!,
              name: user.name || "",
            })
            .select("id")
            .single();

          if (error) {
            console.error("User creation error:", error);
            return false;
          }
          // 첫 로그인 업적 체크
          if (newUser) {
            updateLoginStreak(newUser.id).catch(() => {});
          }
        } else {
          // 기존 사용자 로그인 streak 업데이트
          updateLoginStreak(existingUser.id).catch(() => {});
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.userType = ((user as unknown as Record<string, unknown>).userType as string) || undefined;
        token.status = ((user as unknown as Record<string, unknown>).status as string) || undefined;
      }

      // 로그인 시 provider 저장
      if (account) {
        token.provider = account.provider;
      }

      // 세션 업데이트 요청 시 (온보딩 완료 등)
      if (trigger === "update" && session) {
        if (session.userType !== undefined) token.userType = session.userType;
        if (session.status !== undefined) token.status = session.status;
      }

      // DB에서 user_type/status 동기화
      if (!token.userType && token.email) {
        const supabase = createAdminClient();
        const { data: dbUser } = await supabase
          .from("users")
          .select("id, user_type, status")
          .eq("email", token.email)
          .single();

        if (dbUser) {
          token.sub = dbUser.id;
          token.userType = dbUser.user_type;
          token.status = dbUser.status;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.userType = (token.userType as string) || "";
        session.user.status = (token.status as string) || "active";
        session.user.provider = (token.provider as string) || "credentials";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
