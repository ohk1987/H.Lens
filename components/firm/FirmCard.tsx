"use client";

import Link from "next/link";
import type { SearchFirm } from "@/lib/types";
import { getFirmStats } from "@/lib/mock-data";

interface Props {
  firm: SearchFirm;
}

export default function FirmCard({ firm }: Props) {
  const stats = getFirmStats(firm.id);

  return (
    <Link
      href={`/firms/${firm.id}`}
      className="block border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] card-hover p-5"
    >
      {/* 헤더 */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-primary-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
          {firm.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--foreground)] truncate">{firm.name}</h3>
          {firm.description && (
            <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">{firm.description}</p>
          )}
        </div>
      </div>

      {/* 전문 분야 */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {firm.specialty_fields.map((field) => (
          <span key={field} className="text-xs bg-[var(--muted-bg)] text-[var(--muted)] px-2 py-0.5 rounded-md">
            {field}
          </span>
        ))}
      </div>

      {/* 통계 */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--card-border)]">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <span className="text-sm text-[var(--foreground)] font-medium">{stats.count}명</span>
          <span className="text-xs text-[var(--muted)]">헤드헌터</span>
        </div>
        {stats.avgRating > 0 && (
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-[var(--foreground)]">{stats.avgRating}</span>
          </div>
        )}
        <span className="text-xs text-[var(--muted)]">리뷰 {stats.totalReviews}건</span>
      </div>
    </Link>
  );
}
