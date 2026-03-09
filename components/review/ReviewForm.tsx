"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { STEPS } from "@/lib/review-constants";
import { INITIAL_FORM_DATA, type ReviewFormData, type ReviewerRole } from "@/lib/types/review-form";
import type { SearchFirm } from "@/lib/types";
import StepHeadhunter from "./steps/StepHeadhunter";
import StepBasicInfo from "./steps/StepBasicInfo";
import StepRatings from "./steps/StepRatings";
import StepKeywordsContent from "./steps/StepKeywordsContent";
import StepSubmit from "./steps/StepSubmit";

interface Props {
  searchFirms: SearchFirm[];
}

export default function ReviewForm({ searchFirms }: Props) {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<ReviewFormData>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reviewerRole: ReviewerRole =
    session?.user?.userType === "hr_manager" ? "hr_manager" : "job_seeker";

  const updateForm = (updates: Partial<ReviewFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // 각 스텝 유효성 검사
  const validateStep = (s: number): string | null => {
    switch (s) {
      case 0:
        if (!formData.headhunterName.trim()) return "헤드헌터 이름을 입력해주세요.";
        if (!formData.headhunterEmail.trim()) return "이메일을 입력해주세요.";
        if (!formData.headhunterPhone.trim()) return "핸드폰번호를 입력해주세요.";
        return null;
      case 1:
        if (!formData.contactDate) return "컨택 일자를 선택해주세요.";
        if (!formData.contactChannel) return "컨택 채널을 선택해주세요.";
        if (!formData.companyName.trim()) return "회사명을 입력해주세요.";
        if (!formData.industry) return "산업군을 선택해주세요.";
        if (!formData.jobFunction) return "직무를 선택해주세요.";
        if (!formData.seniority) return "직급/연차를 선택해주세요.";
        if (!formData.progressResult) return "진행 결과를 선택해주세요.";
        return null;
      case 2: {
        const r = formData.ratings;
        if (!r.professionalism || !r.communication || !r.reliability || !r.support || !r.transparency) {
          return "모든 평가 항목에 별점을 입력해주세요.";
        }
        if (reviewerRole === "hr_manager") {
          const hr = formData.hrExtraRatings;
          if (!hr.feeAdequacy || !hr.guaranteeSatisfaction || !hr.contractTerms) {
            return "HR 전용 평가 항목도 모두 입력해주세요.";
          }
        }
        return null;
      }
      case 3:
        if (formData.content.trim().length < 50) return "리뷰 내용을 50자 이상 작성해주세요.";
        if (formData.content.length > 1000) return "리뷰 내용이 1000자를 초과했습니다.";
        return null;
      case 4:
        if (!formData.overallRating) return "종합 평점을 입력해주세요.";
        if (formData.wouldRecommend === null) return "추천 여부를 선택해주세요.";
        return null;
      default:
        return null;
    }
  };

  const [error, setError] = useState("");

  const goNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setError("");
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // TODO: Supabase에 리뷰 저장 API 호출
      // 1. 헤드헌터 없으면 신규 생성
      // 2. 리뷰 저장
      // 3. 증빙 파일 업로드

      // 현재는 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch {
      setError("리뷰 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // 제출 완료 화면
  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">리뷰가 제출되었습니다!</h2>
        <p className="text-[var(--muted)] mb-2">
          {formData.evidenceFile
            ? "증빙 파일이 접수되었습니다. 검토 후 인증 리뷰로 전환됩니다."
            : "일반 리뷰로 즉시 공개됩니다."}
        </p>
        <p className="text-sm text-[var(--muted)] mb-8">소중한 리뷰 감사합니다.</p>
        <div className="flex gap-3 justify-center">
          <a
            href="/headhunters"
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition"
          >
            헤드헌터 목록 보기
          </a>
          <a
            href="/reviews/new"
            className="px-6 py-2.5 border border-[var(--card-border)] text-[var(--foreground)] rounded-xl font-medium hover:bg-[var(--muted-bg)] transition"
          >
            리뷰 하나 더 작성
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 진행률 바 */}
      <div className="mb-8">
        {/* 프로그레스 바 */}
        <div className="h-1.5 bg-[var(--muted-bg)] rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* 스텝 인디케이터 */}
        <div className="flex justify-between">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  i < step
                    ? "bg-primary-600 text-white"
                    : i === step
                    ? "bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900/30"
                    : "bg-[var(--muted-bg)] text-[var(--muted)]"
                }`}
              >
                {i < step ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs mt-1.5 hidden sm:block ${
                  i <= step ? "text-primary-600 font-medium" : "text-[var(--muted)]"
                }`}
              >
                {s.short}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 스텝 제목 */}
      <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
        {STEPS[step].label}
      </h2>
      <p className="text-sm text-[var(--muted)] mb-6">
        {step + 1}/{STEPS.length}단계
        {reviewerRole === "hr_manager" && (
          <span className="ml-2 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-0.5 rounded-full">
            HR 담당자 모드
          </span>
        )}
      </p>

      {/* 스텝 컨텐츠 */}
      <div className="min-h-[300px]">
        {step === 0 && (
          <StepHeadhunter data={formData} onChange={updateForm} searchFirms={searchFirms} />
        )}
        {step === 1 && (
          <StepBasicInfo data={formData} onChange={updateForm} />
        )}
        {step === 2 && (
          <StepRatings data={formData} onChange={updateForm} reviewerRole={reviewerRole} />
        )}
        {step === 3 && (
          <StepKeywordsContent data={formData} onChange={updateForm} />
        )}
        {step === 4 && (
          <StepSubmit data={formData} onChange={updateForm} reviewerRole={reviewerRole} />
        )}
      </div>

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mt-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* 이전/다음 버튼 */}
      <div className="flex justify-between mt-8 pt-6 border-t border-[var(--card-border)]">
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 0}
          className="px-6 py-2.5 border border-[var(--card-border)] rounded-xl text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          이전
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="px-8 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition flex items-center gap-2"
          >
            다음
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                제출 중...
              </>
            ) : (
              <>
                리뷰 제출
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
