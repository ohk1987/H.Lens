import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";
import { USER_TYPE_LABELS, USER_STATUS_LABELS } from "@/lib/constants";
import Link from "next/link";

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  kakao: "카카오",
  credentials: "이메일",
};

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();

  // 내가 작성한 리뷰 조회
  const userId = profile?.id || session.user.id;
  const { data: myReviews } = await supabase
    .from("reviews")
    .select(`
      id,
      rating_overall,
      verification_status,
      created_at,
      headhunter_id,
      headhunters (
        name,
        search_firm_id,
        search_firms (
          name
        )
      )
    `)
    .eq("reviewer_id", userId)
    .order("created_at", { ascending: false });

  const statusColor: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const providerLabel = PROVIDER_LABELS[session.user.provider] || session.user.provider;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">마이페이지</h1>

      {/* 프로필 정보 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
              {(profile?.name || session.user.name)?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {profile?.name || session.user.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[var(--muted)]">
                {USER_TYPE_LABELS[profile?.user_type || session.user.userType] || "미설정"}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                statusColor[profile?.status || session.user.status] || statusColor.active
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
          <div className="bg-[var(--muted-bg)] rounded-xl p-4">
            <p className="text-[var(--muted)] text-xs mb-1">로그인 방식</p>
            <p className="text-[var(--foreground)]">{providerLabel}</p>
          </div>
          {profile?.company_email && (
            <div className="bg-[var(--muted-bg)] rounded-xl p-4">
              <p className="text-[var(--muted)] text-xs mb-1">회사/서치펌 이메일</p>
              <p className="text-[var(--foreground)]">{profile.company_email}</p>
            </div>
          )}
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
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">인증 대기중</h3>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            제출하신 서류를 검토 중입니다. 1~2 영업일 내 승인 처리됩니다.
          </p>
        </section>
      )}

      {(profile?.status || session.user.status) === "rejected" && (
        <section className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">인증 거절</h3>
          <p className="text-sm text-red-700 dark:text-red-400">
            제출하신 서류 검토 결과 인증이 거절되었습니다. 서류를 다시 제출하시려면 고객센터로 문의해주세요.
          </p>
        </section>
      )}

      {/* 내가 작성한 리뷰 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">내가 작성한 리뷰</h2>
        {myReviews && myReviews.length > 0 ? (
          <div className="space-y-3">
            {myReviews.map((review) => {
              const hh = review.headhunters as unknown as { name: string; search_firms: { name: string } | null } | null;
              return (
                <Link
                  key={review.id}
                  href={`/headhunters/${review.headhunter_id}`}
                  className="block bg-[var(--muted-bg)] rounded-xl p-4 hover:bg-[var(--card-border)] transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                        {hh?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)] text-sm">
                          {hh?.name || "알 수 없음"}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {hh?.search_firms?.name || ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.verification_status === "verified" && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                          인증됨
                        </span>
                      )}
                      {review.verification_status === "pending" && (
                        <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                          검토 중
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-sm font-bold text-[var(--foreground)]">
                          {review.rating_overall}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-2">
                    {new Date(review.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-[var(--muted)] text-sm">작성한 리뷰가 없습니다.</p>
        )}
      </section>
    </div>
  );
}
