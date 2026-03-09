import Link from "next/link";
import type { Headhunter } from "@/lib/types";

interface Props {
  headhunter: Headhunter;
  compact?: boolean;
}

const badgeConfig = {
  none: { label: "", color: "" },
  partial: { label: "부분 인증", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  full: { label: "완전 인증", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

export default function HeadhunterCard({ headhunter, compact }: Props) {
  const badge = badgeConfig[headhunter.trust_badge_level];

  return (
    <Link
      href={`/headhunters/${headhunter.id}`}
      className={`block border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] card-hover ${
        compact ? "p-4 min-w-[280px]" : "p-5"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg">
          {headhunter.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          {/* Name + Badge */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[var(--foreground)] truncate">
              {headhunter.name}
            </h3>
            {headhunter.trust_badge_level !== "none" && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </div>

          {/* Firm */}
          <p className="text-sm text-[var(--muted)] mt-0.5">{headhunter.firm_name}</p>

          {/* Specialty Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {headhunter.specialty_fields.slice(0, 3).map((field) => (
              <span
                key={field}
                className="text-xs bg-[var(--muted-bg)] text-[var(--muted)] px-2 py-0.5 rounded-md"
              >
                {field}
              </span>
            ))}
          </div>

          {/* Rating + Reviews */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {headhunter.total_rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                인증 {headhunter.verified_review_count}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                일반 {headhunter.review_count - headhunter.verified_review_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
