"use client";

import { useState } from "react";

interface Props {
  type: "positive" | "negative";
  keywords: string[];
  selected: string[];
  onChange: (keywords: string[]) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
}

const MAX_KEYWORDS = 3;

export default function KeywordSelector({
  type,
  keywords,
  selected,
  onChange,
  customValue,
  onCustomChange,
}: Props) {
  const [showCustom, setShowCustom] = useState(false);

  const isAtMax = selected.length >= MAX_KEYWORDS;

  const toggleKeyword = (keyword: string) => {
    if (selected.includes(keyword)) {
      onChange(selected.filter((k) => k !== keyword));
    } else {
      if (isAtMax) return;
      onChange([...selected, keyword]);
    }
  };

  const addCustomKeyword = () => {
    const trimmed = customValue.trim();
    if (trimmed && !selected.includes(trimmed) && !isAtMax) {
      onChange([...selected, trimmed]);
      onCustomChange("");
    }
  };

  const isPositive = type === "positive";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {isPositive ? "긍정 키워드" : "부정 키워드"} <span className="text-[var(--muted)] font-normal text-xs">(선택)</span>
        </p>
        <span className={`text-xs ${isAtMax ? "text-amber-600 font-medium" : "text-[var(--muted)]"}`}>
          {selected.length}/{MAX_KEYWORDS}개 선택
        </span>
      </div>

      {isAtMax && (
        <p className="text-xs text-amber-600">최대 {MAX_KEYWORDS}개까지 선택할 수 있습니다</p>
      )}

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => {
          const isSelected = selected.includes(keyword);
          const isDisabled = !isSelected && isAtMax;
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => toggleKeyword(keyword)}
              disabled={isDisabled}
              className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                isSelected
                  ? isPositive
                    ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400"
                    : "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
                  : isDisabled
                  ? "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--muted)] opacity-40 cursor-not-allowed"
                  : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
              }`}
            >
              {isSelected && (
                <span className="mr-1">{isPositive ? "+" : "-"}</span>
              )}
              {keyword}
            </button>
          );
        })}
      </div>

      {/* 직접 입력 */}
      <div>
        {!showCustom ? (
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className="text-xs text-primary-600 hover:text-primary-700 transition"
          >
            + 직접 입력하기
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customValue}
                onChange={(e) => onCustomChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomKeyword())}
                placeholder="키워드를 입력하세요"
                disabled={isAtMax}
                className="flex-1 bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-40"
              />
              <button
                type="button"
                onClick={addCustomKeyword}
                disabled={isAtMax}
                className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition disabled:opacity-40"
              >
                추가
              </button>
            </div>
            <p className="text-xs text-[var(--muted)]">
              직접 입력한 키워드는 검토 후 노출됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
