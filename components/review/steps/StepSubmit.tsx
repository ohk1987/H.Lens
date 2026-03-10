"use client";

import StarRating from "@/components/review/StarRating";
import type { ReviewFormData, ReviewerRole } from "@/lib/types/review-form";
import { RATING_LABELS, CONTACT_CHANNELS, SENIORITY_LEVELS, PROGRESS_RESULTS, SCORE_GUIDES } from "@/lib/review-constants";
import type { Ratings } from "@/lib/types";

interface Props {
  data: ReviewFormData;
  onChange: (updates: Partial<ReviewFormData>) => void;
  reviewerRole: ReviewerRole;
}

export default function StepSubmit({ data, onChange, reviewerRole }: Props) {
  void reviewerRole;

  const channelLabel = CONTACT_CHANNELS.find((c) => c.value === data.contactChannel)?.label || data.contactChannel;
  const seniorityLabel = SENIORITY_LEVELS.find((s) => s.value === data.seniority)?.label || data.seniority;
  const resultLabel = PROGRESS_RESULTS.find((p) => p.value === data.progressResult)?.label || data.progressResult;

  const avgRating = Object.values(data.ratings).filter((v) => v > 0);
  const avg = avgRating.length > 0
    ? (avgRating.reduce((a, b) => a + b, 0) / avgRating.length).toFixed(1)
    : "-";

  return (
    <div className="space-y-6">
      {/* 종합 평점 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
        <StarRating
          label="종합 평점"
          value={data.overallRating}
          onChange={(v) => onChange({ overallRating: v })}
          halfStep
          scoreGuides={SCORE_GUIDES.overall}
        />
      </div>

      {/* 추천 여부 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
        <p className="text-sm font-semibold text-[var(--foreground)] mb-3">
          이 헤드헌터를 추천하시겠습니까?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange({ wouldRecommend: true })}
            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${
              data.wouldRecommend === true
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "border-[var(--card-border)] text-[var(--muted)] hover:border-emerald-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            예, 추천합니다
          </button>
          <button
            type="button"
            onClick={() => onChange({ wouldRecommend: false })}
            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${
              data.wouldRecommend === false
                ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                : "border-[var(--card-border)] text-[var(--muted)] hover:border-red-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            아니오
          </button>
        </div>
      </div>

      {/* 증빙 파일 업로드 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-sm font-semibold text-[var(--foreground)]">증빙 파일 업로드</p>
          <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
            선택
          </span>
        </div>
        <p className="text-xs text-[var(--muted)] mb-3">
          이메일 캡처, JD 등 증빙 제출 시 <strong className="text-primary-600">인증 리뷰</strong>로 등록됩니다
        </p>

        <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-5 text-center hover:border-primary-400 transition cursor-pointer relative">
          <input
            type="file"
            accept="image/jpeg,image/png,.pdf"
            onChange={(e) => onChange({ evidenceFile: e.target.files?.[0] || null })}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {data.evidenceFile ? (
            <div className="flex items-center justify-center gap-2 text-sm text-primary-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {data.evidenceFile.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ evidenceFile: null });
                }}
                className="text-[var(--muted)] hover:text-red-500 ml-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 mx-auto text-[var(--muted)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-[var(--muted)]">JPG, PNG, PDF (최대 5MB)</p>
            </>
          )}
        </div>

        <div className="flex items-start gap-2 mt-3 text-xs text-[var(--muted)]">
          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>업로드 파일은 검토 후 즉시 삭제됩니다. 미제출 시 일반 리뷰로 즉시 공개됩니다.</span>
        </div>
      </div>

      {/* 작성 내용 요약 */}
      <div className="bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">작성 내용 요약</h3>

        <div className="space-y-3 text-sm">
          {/* 헤드헌터 */}
          <div className="flex items-start gap-3">
            <span className="text-[var(--muted)] w-20 flex-shrink-0">헤드헌터</span>
            <span className="text-[var(--foreground)] font-medium">
              {data.headhunterName}
              {data.searchFirmCustom && ` (${data.searchFirmCustom})`}
            </span>
          </div>

          {/* 기본 정보 */}
          <div className="flex items-start gap-3">
            <span className="text-[var(--muted)] w-20 flex-shrink-0">컨택 정보</span>
            <span className="text-[var(--foreground)]">
              {data.contactDate} / {channelLabel} / {data.industry} / {data.jobFunction}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-[var(--muted)] w-20 flex-shrink-0">경력/결과</span>
            <span className="text-[var(--foreground)]">{seniorityLabel} / {resultLabel}</span>
          </div>

          {/* 평점 */}
          <div className="flex items-start gap-3">
            <span className="text-[var(--muted)] w-20 flex-shrink-0">평균 평점</span>
            <div className="flex items-center gap-2">
              <span className="text-[var(--foreground)] font-bold">{avg}</span>
              <span className="text-[var(--muted)] text-xs">
                ({(Object.keys(data.ratings) as (keyof Ratings)[]).map((k) =>
                  `${RATING_LABELS[k]} ${data.ratings[k]}`
                ).join(", ")})
              </span>
            </div>
          </div>

          {/* 키워드 */}
          {data.keywordsPositive.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-[var(--muted)] w-20 flex-shrink-0">긍정</span>
              <div className="flex flex-wrap gap-1">
                {data.keywordsPositive.map((k) => (
                  <span key={k} className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">{k}</span>
                ))}
              </div>
            </div>
          )}

          {data.keywordsNegative.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-[var(--muted)] w-20 flex-shrink-0">부정</span>
              <div className="flex flex-wrap gap-1">
                {data.keywordsNegative.map((k) => (
                  <span key={k} className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">{k}</span>
                ))}
              </div>
            </div>
          )}

          {/* 리뷰 미리보기 */}
          <div className="flex items-start gap-3">
            <span className="text-[var(--muted)] w-20 flex-shrink-0">리뷰</span>
            <p className="text-[var(--foreground)] text-xs leading-relaxed line-clamp-3">
              &ldquo;{data.content}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 익명 처리 안내 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300 flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <div>
          <p className="font-medium mb-1">익명 보장 안내</p>
          <p className="text-xs leading-relaxed">
            회원님의 이름, 이메일, 회사명 등 개인 식별 정보는 절대 공개되지 않습니다.
            리뷰는 익명으로 처리되며, 헤드헌터도 리뷰어를 확인할 수 없습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
