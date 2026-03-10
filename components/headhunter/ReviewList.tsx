"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MOCK_REVIEWS, MOCK_HEADHUNTERS } from "@/lib/mock-data";
import type { Review } from "@/lib/types";
import ReviewCard from "./ReviewCard";

interface Props {
  headhunterId: string;
}

type TabType = "all" | "verified" | "general";
type ReviewerFilter = "all" | "job_seeker" | "hr_manager";

type ReviewWithMeta = Review & { headhunter_name: string; headhunter_firm: string };

export default function ReviewList({ headhunterId }: Props) {
  const { data: session } = useSession();
  const [tab, setTab] = useState<TabType>("all");
  const [reviewerFilter, setReviewerFilter] = useState<ReviewerFilter>("all");
  const [localReviews, setLocalReviews] = useState<ReviewWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      // 1. API에서 조회 시도
      try {
        const res = await fetch(`/api/headhunters/${headhunterId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length >= 0) {
            setLocalReviews(data.reviews);
            setIsOwner(
              data.headhunter?.is_claimed &&
              session?.user?.userType === "headhunter"
            );
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Reviews API fetch failed, trying mock data:", err);
      }

      // 2. 실패 시 mock 데이터
      const hunter = MOCK_HEADHUNTERS.find((h) => h.id === headhunterId);
      const mockReviewsForHunter = MOCK_REVIEWS
        .filter((r) => r.headhunter_id === headhunterId)
        .map((r) => ({
          ...r,
          headhunter_name: hunter?.name || "",
          headhunter_firm: hunter?.firm_name || "",
        }));
      setLocalReviews(mockReviewsForHunter);
      setIsOwner(
        (hunter?.is_claimed && session?.user?.userType === "headhunter") || false
      );
      setLoading(false);
    }
    fetchReviews();
  }, [headhunterId, session]);

  const reviews = useMemo(() => {
    let list = [...localReviews];

    if (tab === "verified") list = list.filter((r) => r.review_type === "verified");
    if (tab === "general") list = list.filter((r) => r.review_type === "general");
    if (reviewerFilter !== "all") list = list.filter((r) => r.reviewer_type === reviewerFilter);

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [localReviews, tab, reviewerFilter]);

  const allCount = localReviews.length;
  const verifiedCount = localReviews.filter((r) => r.review_type === "verified").length;
  const generalCount = allCount - verifiedCount;

  const handleReply = (reviewId: string, content: string) => {
    setLocalReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, headhunter_reply: content } : r
      )
    );
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: "all", label: "전체", count: allCount },
    { key: "verified", label: "인증 리뷰", count: verifiedCount },
    { key: "general", label: "일반 리뷰", count: generalCount },
  ];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-[var(--muted)] text-sm">리뷰를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div>
      {/* 탭 */}
      <div className="flex items-center gap-1 mb-4 border-b border-[var(--card-border)]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
              tab === t.key
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {t.label} <span className="text-xs">({t.count})</span>
          </button>
        ))}
      </div>

      {/* 리뷰어 유형 필터 */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-[var(--muted)]">작성자:</span>
        {(
          [
            { key: "all", label: "전체" },
            { key: "job_seeker", label: "구직자" },
            { key: "hr_manager", label: "HR 담당자" },
          ] as { key: ReviewerFilter; label: string }[]
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setReviewerFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              reviewerFilter === f.key
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                : "border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 리뷰 목록 */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showReplyForm={isOwner || false}
              onReply={handleReply}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--muted-bg)] rounded-xl p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <p className="text-[var(--muted)]">아직 작성된 리뷰가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
