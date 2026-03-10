"use client";

import { useEffect, useState } from "react";
import ScrollSection from "@/components/ui/ScrollSection";
import Link from "next/link";
// TODO: 실제 데이터로 대체 예정
import { MOCK_REVIEWS } from "@/lib/mock-data";

interface RecentReview {
  id: string;
  headhunter_id: string;
  headhunter_name: string;
  headhunter_firm: string;
  review_type: string;
  rating_overall: number;
  ratings: {
    professionalism: number;
    communication: number;
    reliability: number;
    support: number;
    transparency: number;
  };
  keywords_positive: string[];
  content: string;
  job_field: string;
  created_at: string;
}

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

function SkeletonCard() {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-[var(--muted-bg)] rounded-full" />
        <div className="h-4 bg-[var(--muted-bg)] rounded w-32" />
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 bg-[var(--muted-bg)] rounded w-16" />
        <div className="h-5 bg-[var(--muted-bg)] rounded w-20" />
      </div>
      <div className="h-3 bg-[var(--muted-bg)] rounded w-24 mb-3" />
      <div className="space-y-2">
        <div className="h-3 bg-[var(--muted-bg)] rounded w-full" />
        <div className="h-3 bg-[var(--muted-bg)] rounded w-3/4" />
      </div>
    </div>
  );
}

export default function LatestReviews() {
  const [reviews, setReviews] = useState<RecentReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews/recent")
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          // DB 데이터가 없으면 mock 데이터 fallback
          setReviews(
            MOCK_REVIEWS.slice(0, 6).map((r) => ({
              id: r.id,
              headhunter_id: r.headhunter_id,
              headhunter_name: r.headhunter_name,
              headhunter_firm: r.headhunter_firm,
              review_type: r.review_type,
              rating_overall: Object.values(r.ratings).reduce((a, b) => a + b, 0) / 5,
              ratings: r.ratings,
              keywords_positive: r.keywords_positive,
              content: r.content,
              job_field: r.job_field,
              created_at: r.created_at,
            }))
          );
        }
      })
      .catch(() => {
        // 조회 실패 → mock 데이터 fallback
        setReviews(
          MOCK_REVIEWS.slice(0, 6).map((r) => ({
            id: r.id,
            headhunter_id: r.headhunter_id,
            headhunter_name: r.headhunter_name,
            headhunter_firm: r.headhunter_firm,
            review_type: r.review_type,
            rating_overall: Object.values(r.ratings).reduce((a, b) => a + b, 0) / 5,
            ratings: r.ratings,
            keywords_positive: r.keywords_positive,
            content: r.content,
            job_field: r.job_field,
            created_at: r.created_at,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

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

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, i) => {
              const avg = Object.values(review.ratings).reduce((a, b) => a + b, 0) / 5;

              return (
                <ScrollSection key={review.id} delay={i * 100}>
                  <Link
                    href={`/headhunters/${review.headhunter_id}`}
                    className="block bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 h-full card-hover"
                  >
                    {/* 상단: 헤드헌터 정보 */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {review.headhunter_name.charAt(0)}
                      </div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {review.headhunter_name}{" "}
                        {review.headhunter_firm && (
                          <>
                            <span className="font-normal text-[var(--muted)]">·</span>{" "}
                            <span className="font-normal text-[var(--muted)]">{review.headhunter_firm}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* 인증 배지 + 분야 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          review.review_type === "verified"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {review.review_type === "verified" ? "인증 리뷰" : "일반 리뷰"}
                      </span>
                      {review.job_field && (
                        <span className="text-xs text-[var(--muted)] bg-[var(--muted-bg)] px-2.5 py-1 rounded-full">
                          {review.job_field}
                        </span>
                      )}
                    </div>

                    {/* 별점 */}
                    <div className="flex items-center gap-2 mb-3">
                      <StarDisplay rating={Math.round(avg)} />
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        {avg.toFixed(1)}
                      </span>
                    </div>

                    {/* 키워드 태그 */}
                    {review.keywords_positive.length > 0 && (
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
                    )}

                    {/* 리뷰 내용 */}
                    <p className="text-sm text-[var(--foreground)] leading-relaxed line-clamp-3">
                      &ldquo;{review.content}&rdquo;
                    </p>
                  </Link>
                </ScrollSection>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--muted)]">아직 작성된 리뷰가 없습니다.</p>
            <Link href="/reviews/new" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
              첫 번째 리뷰를 작성해보세요
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
