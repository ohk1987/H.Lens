"use client";

import ScrollSection from "@/components/ui/ScrollSection";
import { MOCK_REVIEWS } from "@/lib/mock-data";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function LatestReviews() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              최신 리뷰
            </h2>
            <p className="text-[var(--muted)] mt-2">
              실제 경험자들의 생생한 후기를 확인하세요
            </p>
          </div>
        </ScrollSection>

        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_REVIEWS.map((review, i) => {
            const avg = Object.values(review.ratings).reduce((a, b) => a + b, 0) / 5;

            return (
              <ScrollSection key={review.id} delay={i * 100}>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 h-full card-hover">
                  {/* 상단: 인증 배지 + 분야 */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        review.review_type === "verified"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {review.review_type === "verified" ? "인증 리뷰" : "일반 리뷰"}
                    </span>
                    <span className="text-xs text-[var(--muted)] bg-[var(--muted-bg)] px-2.5 py-1 rounded-full">
                      {review.job_field}
                    </span>
                  </div>

                  {/* 별점 */}
                  <div className="flex items-center gap-2 mb-3">
                    <StarDisplay rating={Math.round(avg)} />
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {avg.toFixed(1)}
                    </span>
                  </div>

                  {/* 키워드 태그 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {review.keywords_positive.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* 리뷰 내용 */}
                  <p className="text-sm text-[var(--foreground)] leading-relaxed mb-4 line-clamp-3">
                    &ldquo;{review.content}&rdquo;
                  </p>

                  {/* 하단: 헤드헌터 정보 */}
                  <div className="pt-4 border-t border-[var(--card-border)] flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {review.headhunter_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {review.headhunter_name}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{review.headhunter_firm}</p>
                    </div>
                  </div>
                </div>
              </ScrollSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
