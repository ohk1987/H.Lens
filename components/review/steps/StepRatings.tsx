"use client";

import StarRating from "@/components/review/StarRating";
import type { ReviewFormData, ReviewerRole } from "@/lib/types/review-form";
import type { Ratings } from "@/lib/types";
import { RATING_GUIDES, RATING_LABELS, HR_EXTRA_RATING_LABELS, SCORE_GUIDES } from "@/lib/review-constants";

interface Props {
  data: ReviewFormData;
  onChange: (updates: Partial<ReviewFormData>) => void;
  reviewerRole: ReviewerRole;
}

const RATING_KEYS: (keyof Ratings)[] = [
  "professionalism",
  "communication",
  "reliability",
  "support",
  "transparency",
];

export default function StepRatings({ data, onChange, reviewerRole }: Props) {
  const guides = RATING_GUIDES[reviewerRole === "hr_manager" ? "hr_manager" : "job_seeker"];

  const updateRating = (key: keyof Ratings, value: number) => {
    onChange({ ratings: { ...data.ratings, [key]: value } });
  };

  const updateHrRating = (key: string, value: number) => {
    onChange({ hrExtraRatings: { ...data.hrExtraRatings, [key]: value } });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        각 항목에 대해 1~5점으로 평가해주세요. 가이드 문구를 참고하시면 더 정확한 평가가 가능합니다.
      </p>

      <div className="space-y-6">
        {RATING_KEYS.map((key) => (
          <div
            key={key}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4"
          >
            <StarRating
              label={RATING_LABELS[key]}
              value={data.ratings[key]}
              onChange={(v) => updateRating(key, v)}
              guide={guides[key]}
              scoreGuides={SCORE_GUIDES[key]}
            />
          </div>
        ))}
      </div>

      {/* HR 담당자 추가 항목 */}
      {reviewerRole === "hr_manager" && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              HR 담당자 전용 평가
            </h3>
            <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-0.5 rounded-full">
              HR 전용
            </span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            수수료율 등 계약 세부 내용은 통계 목적으로만 활용되며 절대 공개되지 않습니다
          </div>

          <div className="space-y-6">
            {(Object.keys(HR_EXTRA_RATING_LABELS) as (keyof typeof HR_EXTRA_RATING_LABELS)[]).map((key) => (
              <div
                key={key}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4"
              >
                <StarRating
                  label={HR_EXTRA_RATING_LABELS[key]}
                  value={data.hrExtraRatings[key]}
                  onChange={(v) => updateHrRating(key, v)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
