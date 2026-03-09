"use client";

import KeywordSelector from "@/components/review/KeywordSelector";
import type { ReviewFormData } from "@/lib/types/review-form";
import { POSITIVE_KEYWORDS, NEGATIVE_KEYWORDS } from "@/lib/review-constants";

interface Props {
  data: ReviewFormData;
  onChange: (updates: Partial<ReviewFormData>) => void;
}

export default function StepKeywordsContent({ data, onChange }: Props) {
  const charCount = data.content.length;
  const isUnderMin = charCount > 0 && charCount < 50;
  const isOverMax = charCount > 1000;

  return (
    <div className="space-y-8">
      {/* 긍정 키워드 */}
      <KeywordSelector
        type="positive"
        keywords={POSITIVE_KEYWORDS}
        selected={data.keywordsPositive}
        onChange={(kw) => onChange({ keywordsPositive: kw })}
        customValue={data.customPositiveKeyword}
        onCustomChange={(v) => onChange({ customPositiveKeyword: v })}
      />

      {/* 부정 키워드 */}
      <KeywordSelector
        type="negative"
        keywords={NEGATIVE_KEYWORDS}
        selected={data.keywordsNegative}
        onChange={(kw) => onChange({ keywordsNegative: kw })}
        customValue={data.customNegativeKeyword}
        onCustomChange={(v) => onChange({ customNegativeKeyword: v })}
      />

      {/* 상세 리뷰 */}
      <div>
        <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
          상세 리뷰 <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-[var(--muted)] mb-2">
          헤드헌터와의 경험을 구체적으로 작성해주세요. (최소 50자)
        </p>
        <textarea
          value={data.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className={`w-full bg-[var(--muted-bg)] border rounded-xl px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none resize-none h-40 ${
            isUnderMin || isOverMax
              ? "border-red-400"
              : "border-[var(--card-border)]"
          }`}
          placeholder="어떤 경험을 하셨나요? 헤드헌터의 강점과 개선이 필요한 부분을 구체적으로 적어주시면 다른 사용자에게 큰 도움이 됩니다."
          maxLength={1100}
        />
        <div className="flex items-center justify-between mt-1.5">
          {isUnderMin && (
            <p className="text-xs text-red-500">최소 50자 이상 작성해주세요</p>
          )}
          {isOverMax && (
            <p className="text-xs text-red-500">1000자를 초과했습니다</p>
          )}
          {!isUnderMin && !isOverMax && <div />}
          <p
            className={`text-xs ${
              isUnderMin || isOverMax ? "text-red-500" : "text-[var(--muted)]"
            }`}
          >
            {charCount}/1000
          </p>
        </div>
      </div>
    </div>
  );
}
