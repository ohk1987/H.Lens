"use client";

import type { ReviewFormData } from "@/lib/types/review-form";
import {
  CONTACT_CHANNELS,
  JOBSITE_SUB_OPTIONS,
  COMPANY_SIZES,
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
        <div className="relative">
          <input
            type="date"
            value={data.contactDate}
            onChange={(e) => onChange({ contactDate: e.target.value })}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer ${data.contactDate ? "text-transparent" : "text-[var(--foreground)]"}`}
          />
          {data.contactDate && (
            <span
              className="absolute inset-0 flex items-center px-4 text-[var(--foreground)] pointer-events-none"
            >
              {(() => {
                const [y, m, d] = data.contactDate.split("-");
                return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
              })()}
            </span>
          )}
        </div>
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

      {/* 제안 포지션 관련 정보 */}
      <div className="border border-[var(--card-border)] rounded-2xl p-5 space-y-5 bg-[var(--card-bg)]">
        <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M3.5 10.5h17a1 1 0 011 1v7a2 2 0 01-2 2h-15a2 2 0 01-2-2v-7a1 1 0 011-1z" />
          </svg>
          제안 포지션 관련 정보
        </h3>

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

        {/* 기업 구분 */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            기업 구분 <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {COMPANY_SIZES.map((cs) => (
              <button
                key={cs.value}
                type="button"
                onClick={() => onChange({ companySize: cs.value })}
                className={`px-3 py-1.5 rounded-full border text-sm transition ${
                  data.companySize === cs.value
                    ? "border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                    : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:border-primary-300"
                }`}
              >
                {cs.label}
              </button>
            ))}
          </div>
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
