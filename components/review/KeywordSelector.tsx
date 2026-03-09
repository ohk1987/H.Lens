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

export default function KeywordSelector({
  type,
  keywords,
  selected,
  onChange,
  customValue,
  onCustomChange,
}: Props) {
  const [showCustom, setShowCustom] = useState(false);

  const toggleKeyword = (keyword: string) => {
    if (selected.includes(keyword)) {
      onChange(selected.filter((k) => k !== keyword));
    } else {
      onChange([...selected, keyword]);
    }
  };

  const addCustomKeyword = () => {
    const trimmed = customValue.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      onCustomChange("");
    }
  };

  const isPositive = type === "positive";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {isPositive ? "긍정 키워드" : "부정 키워드"}
        </p>
        <span className="text-xs text-[var(--muted)]">
          {selected.length}개 선택
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => toggleKeyword(keyword)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
              selected.includes(keyword)
                ? isPositive
                  ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400"
                  : "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
                : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
            }`}
          >
            {selected.includes(keyword) && (
              <span className="mr-1">{isPositive ? "+" : "-"}</span>
            )}
            {keyword}
          </button>
        ))}
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
                className="flex-1 bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={addCustomKeyword}
                className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition"
              >
                추가
              </button>
            </div>
            <p className="text-xs text-[var(--muted)]">
              관리자 검토 후 공개됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
