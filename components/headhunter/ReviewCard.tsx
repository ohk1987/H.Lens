"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Review, Ratings } from "@/lib/types";
import { RATING_LABELS, COMPANY_SIZE_LABELS } from "@/lib/review-constants";

interface Props {
  review: Review & { headhunter_name: string; headhunter_firm: string };
  showReplyForm?: boolean;
  onReply?: (reviewId: string, content: string) => void;
}

const reviewerTypeLabel: Record<string, string> = {
  job_seeker: "구직자",
  hr_manager: "HR 담당자",
  headhunter: "헤드헌터",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const REPORT_TYPES = [
  { value: "fake", label: "허위 리뷰" },
  { value: "abuse", label: "욕설/비방" },
  { value: "privacy", label: "개인정보 노출" },
  { value: "other", label: "기타" },
];

export default function ReviewCard({ review, showReplyForm, onReply }: Props) {
  const { data: session } = useSession();
  const avgRating = Object.values(review.ratings).reduce((a, b) => a + b, 0) / 5;
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            review.review_type === "verified"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          }`}>
            {review.review_type === "verified" ? "인증 리뷰" : "일반 리뷰"}
          </span>
          <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
            {reviewerTypeLabel[review.reviewer_type] || review.reviewer_type}
          </span>
          {review.career_level && (
            <span className="text-xs text-[var(--muted)]">· {review.career_level}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-bold text-[var(--foreground)]">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      {/* 메타 정보 */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)] mb-3">
        <span>{formatDate(review.created_at)}</span>
        <span>{review.job_field}</span>
        {review.company_size && (
          <span>{COMPANY_SIZE_LABELS[review.company_size] || review.company_size}</span>
        )}
      </div>

      {/* 항목별 평점 (간략) */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(Object.keys(RATING_LABELS) as (keyof Ratings)[]).map((key) => (
          <span key={key} className="text-xs text-[var(--muted)]">
            {RATING_LABELS[key]} <span className="font-medium text-[var(--foreground)]">{review.ratings[key].toFixed(1)}</span>
          </span>
        ))}
      </div>

      {/* 키워드 */}
      {(review.keywords_positive.length > 0 || review.keywords_negative.length > 0) && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {review.keywords_positive.map((k) => (
            <span key={k} className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">{k}</span>
          ))}
          {review.keywords_negative.map((k) => (
            <span key={k} className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">{k}</span>
          ))}
        </div>
      )}

      {/* 리뷰 본문 */}
      <p className="text-sm text-[var(--foreground)] leading-relaxed mb-3">{review.content}</p>

      {/* 하단: 더보기 메뉴 */}
      <div className="flex items-center justify-end relative">
        <button
          onClick={() => setReportMenuOpen(!reportMenuOpen)}
          className="text-[var(--muted)] hover:text-[var(--foreground)] transition p-1 rounded"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        {reportMenuOpen && (
          <div className="absolute right-0 bottom-full mb-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
            <button
              onClick={() => { setReportMenuOpen(false); setShowReportModal(true); }}
              className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-[var(--muted-bg)] transition flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
              신고하기
            </button>
          </div>
        )}
      </div>

      {/* 신고 모달 */}
      {showReportModal && (
        <ReportModal
          reviewId={review.id}
          isLoggedIn={!!session}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* 헤드헌터 답글 */}
      {review.headhunter_reply && (
        <div className="mt-4 bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {review.headhunter_name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-[var(--foreground)]">{review.headhunter_name}</span>
            <span className="text-xs text-[var(--muted)]">헤드헌터 답글</span>
          </div>
          <p className="text-sm text-[var(--foreground)] leading-relaxed">{review.headhunter_reply}</p>
        </div>
      )}

      {/* 답글 작성 폼 */}
      {showReplyForm && !review.headhunter_reply && (
        <ReplyForm reviewId={review.id} onSubmit={onReply} />
      )}
    </div>
  );
}

function ReportModal({ reviewId, isLoggedIn, onClose }: { reviewId: string; isLoggedIn: boolean; onClose: () => void }) {
  const [reportType, setReportType] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reportType) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId, report_type: reportType, reason: reason.trim() }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
          <p className="text-sm text-[var(--foreground)] mb-4">신고하려면 로그인이 필요합니다.</p>
          <button onClick={onClose} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 max-w-md mx-4 shadow-xl w-full">
        {submitted ? (
          <div className="text-center py-4">
            <svg className="w-12 h-12 mx-auto text-emerald-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-[var(--foreground)] mb-4">신고가 접수되었습니다.</p>
            <button onClick={onClose} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
              확인
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">리뷰 신고</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-2">신고 유형</p>
                <div className="grid grid-cols-2 gap-2">
                  {REPORT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setReportType(t.value)}
                      className={`text-xs px-3 py-2 rounded-lg border transition ${
                        reportType === t.value
                          ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : "border-[var(--card-border)] text-[var(--muted)] hover:border-red-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-2">신고 사유 (선택)</p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={200}
                  className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] resize-none h-20 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="구체적인 사유를 입력해주세요. (최대 200자)"
                />
                <p className="text-xs text-[var(--muted)] text-right mt-1">{reason.length}/200</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border border-[var(--card-border)] rounded-xl text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reportType || submitting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {submitting ? "제출 중..." : "신고 접수"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReplyForm({ reviewId, onSubmit }: { reviewId: string; onSubmit?: (id: string, content: string) => void }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || content.length < 10) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    onSubmit?.(reviewId, content);
    setSubmitting(false);
  };

  return (
    <div className="mt-4 border-t border-[var(--card-border)] pt-4">
      <p className="text-xs font-medium text-[var(--foreground)] mb-2">답글 작성 (1회, 수정 불가)</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] resize-none h-20 focus:ring-2 focus:ring-primary-500 outline-none"
        placeholder="리뷰에 대한 답글을 작성해주세요. (최소 10자)"
        maxLength={500}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-[var(--muted)]">{content.length}/500</span>
        <button
          onClick={handleSubmit}
          disabled={submitting || content.trim().length < 10}
          className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          {submitting ? "제출 중..." : "답글 등록"}
        </button>
      </div>
    </div>
  );
}
