import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { createClient } from "@/lib/supabase/server";
import { USER_TYPE_LABELS, USER_STATUS_LABELS } from "@/lib/constants";

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", session.user.email)
    .single();

  const statusColor = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">마이페이지</h1>

      {/* 프로필 정보 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          {session.user.image ? (
            <img src={session.user.image} alt="" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
              {session.user.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {profile?.nickname || session.user.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[var(--muted)]">
                {USER_TYPE_LABELS[profile?.user_type || session.user.userType] || "구직자"}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                statusColor[(profile?.status || session.user.status) as keyof typeof statusColor] || statusColor.active
              }`}>
                {USER_STATUS_LABELS[profile?.status || session.user.status] || "활성"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-[var(--muted-bg)] rounded-xl p-4">
            <p className="text-[var(--muted)] text-xs mb-1">이메일</p>
            <p className="text-[var(--foreground)]">{session.user.email}</p>
          </div>
          {profile?.company_email && (
            <div className="bg-[var(--muted-bg)] rounded-xl p-4">
              <p className="text-[var(--muted)] text-xs mb-1">회사 이메일</p>
              <div className="flex items-center gap-2">
                <p className="text-[var(--foreground)]">{profile.company_email}</p>
                {profile.company_email_verified && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded">인증됨</span>
                )}
              </div>
            </div>
          )}
          <div className="bg-[var(--muted-bg)] rounded-xl p-4">
            <p className="text-[var(--muted)] text-xs mb-1">로그인 방식</p>
            <p className="text-[var(--foreground)] capitalize">{profile?.provider || "email"}</p>
          </div>
          <div className="bg-[var(--muted-bg)] rounded-xl p-4">
            <p className="text-[var(--muted)] text-xs mb-1">가입일</p>
            <p className="text-[var(--foreground)]">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("ko-KR") : "-"}
            </p>
          </div>
        </div>
      </section>

      {/* 상태별 안내 */}
      {(profile?.status || session.user.status) === "pending" && (
        <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">승인 대기 중</h3>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            제출하신 서류를 검토 중입니다. 1~2 영업일 내 승인 처리됩니다.
            승인 완료 시 이메일로 알려드립니다.
          </p>
        </section>
      )}

      {/* 내가 작성한 리뷰 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">내가 작성한 리뷰</h2>
        <p className="text-[var(--muted)] text-sm">작성한 리뷰가 없습니다.</p>
      </section>
    </div>
  );
}
