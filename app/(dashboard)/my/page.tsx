import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";
import { USER_TYPE_LABELS, USER_STATUS_LABELS } from "@/lib/constants";
import Link from "next/link";
import AchievementsSection from "@/components/my/AchievementsSection";
import NicknameEditor from "@/components/my/NicknameEditor";
import ReviewActions from "@/components/my/ReviewActions";
import MyPageTabs from "@/components/my/MyPageTabs";

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

  // 대표 배지 (is_displayed = true)
  const { data: displayedBadges } = await supabase
    .from("user_achievements")
    .select("achievement_id, achievements(name, grade, icon)")
    .eq("user_id", userId)
    .eq("is_displayed", true)
    .limit(3);

  const statusColor: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const providerLabel = PROVIDER_LABELS[session.user.provider] || session.user.provider;

  const gradeColors: Record<string, string> = {
    bronze: "from-amber-600 to-amber-700",
    silver: "from-gray-400 to-gray-500",
    gold: "from-yellow-400 to-yellow-500",
    platinum: "from-purple-500 to-purple-600",
  };

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
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {profile?.name || session.user.name}
            </h2>
            {profile?.nickname && (
              <NicknameEditor initialNickname={profile.nickname} />
            )}
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

            {/* 대표 배지 */}
            {displayedBadges && displayedBadges.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                {displayedBadges.map((badge) => {
                  const ach = badge.achievements as unknown as { name: string; grade: string; icon: string } | null;
                  if (!ach) return null;
                  return (
                    <span
                      key={badge.achievement_id}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${
                        gradeColors[ach.grade] || gradeColors.bronze
                      }`}
                      title={ach.name}
                    >
                      🏆 {ach.name}
                    </span>
                  );
                })}
              </div>
            )}
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
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">인증 대기중</h3>
          </div>
          <div className="space-y-2 text-sm text-amber-700 dark:text-amber-400">
            <p>서류 검토는 영업일 기준 1~2일 소요됩니다.</p>
            <p>검토 완료 후 이메일로 안내드립니다.</p>
            <p>문의: <a href="mailto:support@hlens.app" className="underline font-medium">support@hlens.app</a></p>
          </div>
          {profile?.created_at && (
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
              서류 제출일: {new Date(profile.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
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

      {/* 탭 기반 콘텐츠 */}
      <MyPageTabs
        showInterestedTab={profile?.user_type !== "headhunter"}
        reviewsContent={
          myReviews && myReviews.length > 0 ? (
            <div className="space-y-3">
              {myReviews.map((review) => {
                const hh = review.headhunters as unknown as { name: string; search_firms: { name: string } | null } | null;
                return (
                  <div
                    key={review.id}
                    className="bg-[var(--muted-bg)] rounded-xl p-4"
                  >
                    <Link
                      href={`/headhunters/${review.headhunter_id}`}
                      className="block hover:opacity-80 transition"
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
                    <ReviewActions reviewId={review.id} />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--muted)] text-sm">작성한 리뷰가 없습니다.</p>
          )
        }
        achievementsContent={<AchievementsSection />}
      />
    </div>
  );
}
