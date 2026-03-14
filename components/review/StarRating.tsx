"use client";

import { useState, useId } from "react";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  guide?: string;
  scoreGuides?: Record<number, string>;
  halfStep?: boolean;
}

export default function StarRating({ label, value, onChange, guide, scoreGuides, halfStep }: Props) {
  const [hover, setHover] = useState(0);
  const uniqueId = useId();

  // 가이드 텍스트: hover 시 hover 점수 가이드, 그 외엔 선택된 점수 가이드 고정
  const hoverKey = halfStep ? Math.ceil(hover) : Math.round(hover);
  const valueKey = halfStep ? Math.ceil(value) : Math.round(value);
  const hoverGuide = hover > 0 && scoreGuides ? scoreGuides[hoverKey] : null;
  const valueGuide = value > 0 && scoreGuides ? scoreGuides[valueKey] : null;
  const displayGuide = hoverGuide || valueGuide || guide || (scoreGuides ? "별점을 선택해주세요" : undefined);

  // 별이 채워지는 기준값 (hover 우선, 없으면 value, 둘 다 0이면 -1로 아무것도 안 채움)
  const fillLevel = hover > 0 ? hover : value > 0 ? value : -1;

  if (halfStep) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
          <span className="text-sm font-bold text-primary-600">{value > 0 ? `${value % 1 === 0 ? value : value.toFixed(1)}점` : "-"}</span>
        </div>
        {displayGuide && (
          <p className={`text-xs leading-relaxed min-h-[1.25rem] ${
            hover > 0 ? "text-primary-600 font-medium" : "text-[var(--muted)]"
          }`}>
            {displayGuide}
          </p>
        )}
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="relative cursor-pointer">
              {/* Left half */}
              <div
                className="absolute inset-0 w-1/2 z-10"
                onMouseEnter={() => setHover(star - 0.5)}
                onMouseLeave={() => setHover(0)}
                onClick={() => onChange(star - 0.5)}
              />
              {/* Right half */}
              <div
                className="absolute inset-0 left-1/2 w-1/2 z-10"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => onChange(star)}
              />
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                {/* Background star (empty outline) */}
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  className="fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600"
                  strokeWidth="0.5"
                />
                {/* Filled portion */}
                <defs>
                  <clipPath id={`clip-${uniqueId}-${star}`}>
                    <rect
                      x="0" y="0"
                      width={
                        fillLevel >= star ? "24" :
                        fillLevel >= star - 0.5 ? "12" : "0"
                      }
                      height="24"
                    />
                  </clipPath>
                </defs>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  className="fill-yellow-400"
                  clipPath={`url(#clip-${uniqueId}-${star})`}
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
        <span className="text-sm font-bold text-primary-600">{value > 0 ? `${value % 1 === 0 ? value : value.toFixed(1)}점` : "-"}</span>
      </div>
      {displayGuide && (
        <p className={`text-xs leading-relaxed min-h-[1.25rem] ${
          hover > 0 ? "text-primary-600 font-medium" : "text-[var(--muted)]"
        }`}>
          {displayGuide}
        </p>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            className="transition"
          >
            <svg
              className={`w-8 h-8 transition-colors`}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                className={star <= fillLevel
                  ? "fill-yellow-400"
                  : "fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600"}
                strokeWidth={star <= fillLevel ? "0" : "0.5"}
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
