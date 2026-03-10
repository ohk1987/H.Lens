"use client";

import type { ReviewFormData } from "@/lib/types/review-form";
import {
  CONTACT_CHANNELS,
  JOBSITE_SUB_OPTIONS,
  INDUSTRIES,
  JOB_FUNCTIONS,
  SENIORITY_LEVELS,
  PROGRESS_RESULTS,
} from "@/lib/review-constants";

interface Props {
  data: ReviewFormData;
  onChange: (updates: Partial<ReviewFormData>) => void;
}

export default function StepBasicInfo({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      {/* 포지션 제안 받은 날짜 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          포지션 제안 받은 날짜 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.contactDate}
          onChange={(e) => onChange({ contactDate: e.target.value })}
          max={new Date().toISOString().split("T")[0]}
          placeholder="제안을 받으신 날짜를 선택해주세요"
          className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
      </div>

      {/* 컨택 채널 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          컨택 채널 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CONTACT_CHANNELS.map((ch) => (
            <button
              key={ch.value}
              type="button"
              onClick={() => onChange({ contactChannel: ch.value, contactChannelDetail: "" })}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                data.contactChannel === ch.value
                  ? "border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-primary-300"
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* 채용플랫폼 세부 선택 */}
        {data.contactChannel === "job_site" && (
          <div className="mt-3 ml-2 space-y-2">
            <p className="text-xs text-[var(--muted)] mb-2">플랫폼을 선택해주세요</p>
            <div className="grid grid-cols-2 gap-2">
              {JOBSITE_SUB_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ contactChannelDetail: opt.value })}
                  className={`px-3 py-2 rounded-lg border text-sm transition ${
                    data.contactChannelDetail === opt.value
                      ? "border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                      : "border-[var(--card-border)] bg-[var(--muted-bg)] text-[var(--muted)] hover:border-primary-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {data.contactChannelDetail === "jobsite_other" && (
              <input
                type="text"
                value={data.contactChannelCustom || ""}
                onChange={(e) => onChange({ contactChannelCustom: e.target.value })}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none mt-2"
                placeholder="플랫폼명을 입력하세요"
              />
            )}
          </div>
        )}
      </div>

      {/* 회사명 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          회사명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="제안받은 회사명"
        />
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          회사명은 데이터 수집 목적으로만 사용되며 절대 공개되지 않습니다
        </p>
      </div>

      {/* 산업군 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          산업군 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => onChange({ industry: ind })}
              className={`px-3 py-1.5 rounded-full border text-sm transition ${
                data.industry === ind
                  ? "border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-primary-300"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* 직무 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          직무 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {JOB_FUNCTIONS.map((jf) => (
            <button
              key={jf}
              type="button"
              onClick={() => onChange({ jobFunction: jf })}
              className={`px-3 py-1.5 rounded-full border text-sm transition ${
                data.jobFunction === jf
                  ? "border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-primary-300"
              }`}
            >
              {jf}
            </button>
          ))}
        </div>
      </div>

      {/* 직급/연차 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          직급/연차 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SENIORITY_LEVELS.map((sl) => (
            <button
              key={sl.value}
              type="button"
              onClick={() => onChange({ seniority: sl.value })}
              className={`px-3 py-1.5 rounded-full border text-sm transition ${
                data.seniority === sl.value
                  ? "border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-primary-300"
              }`}
            >
              {sl.label}
            </button>
          ))}
        </div>
      </div>

      {/* 진행 결과 */}
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          진행 결과 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PROGRESS_RESULTS.map((pr) => (
            <button
              key={pr.value}
              type="button"
              onClick={() => onChange({ progressResult: pr.value })}
              className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                data.progressResult === pr.value
                  ? "border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-primary-300"
              }`}
            >
              {pr.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
