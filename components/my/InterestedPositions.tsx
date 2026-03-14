"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InterestedPosition {
  conversation_id: string;
  position_id: string | null;
  status: string;
  interest_date: string;
  updated_at: string;
  position_title: string | null;
  industry: string | null;
  company_size: string | null;
  company_description: string | null;
  headhunter_name: string;
  firm_name: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  pending: { label: "응답 대기 중", icon: "\u23F3", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  active: { label: "메시지 중", icon: "\uD83D\uDCAC", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  reviewing: { label: "서류 검토 중", icon: "\uD83D\uDCCB", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  interview: { label: "인터뷰 진행", icon: "\uD83C\uDFAF", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  completed: { label: "완료", icon: "\u2705", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  unmatched: { label: "미매칭", icon: "\u274C", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const COMPANY_SIZE_LABELS: Record<string, string> = {
  startup: "스타트업",
  small: "중소기업",
  medium: "중견기업",
  large: "대기업",
  foreign: "외국계",
};

export default function InterestedPositions() {
  const [positions, setPositions] = useState<InterestedPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my/interested-positions")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setPositions(d.positions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-[var(--muted)] mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        <p className="text-[var(--muted)] text-sm">관심 표현한 포지션이 없습니다</p>
        <Link href="/headhunters" className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
          헤드헌터 찾아보기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {positions.map((pos) => {
        const statusConf = STATUS_CONFIG[pos.status] || STATUS_CONFIG.pending;
        return (
          <div
            key={pos.conversation_id}
            className="bg-[var(--muted-bg)] rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-sm text-[var(--foreground)]">
                    {pos.position_title || "일반 관심 표현"}
                  </h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConf.color}`}>
                    {statusConf.icon} {statusConf.label}
                  </span>
                </div>

                {(pos.industry || pos.company_size) && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--muted)]">
                    {pos.industry && <span>{pos.industry}</span>}
                    {pos.industry && pos.company_size && <span>·</span>}
                    {pos.company_size && <span>{COMPANY_SIZE_LABELS[pos.company_size] || pos.company_size}</span>}
                  </div>
                )}

                {pos.company_description && (
                  <p className="text-xs text-[var(--muted)] mt-1">{pos.company_description}</p>
                )}

                <div className="flex items-center gap-2 mt-2 text-xs text-[var(--muted)]">
                  <span>{pos.headhunter_name}</span>
                  {pos.firm_name && (
                    <>
                      <span>·</span>
                      <span>{pos.firm_name}</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-[var(--muted)] mt-1">
                  관심 표현: {new Date(pos.interest_date).toLocaleDateString("ko-KR")}
                </p>
              </div>

              <Link
                href={`/messages/${pos.conversation_id}`}
                className="flex-shrink-0 ml-3 px-3 py-1.5 text-xs font-medium text-primary-600 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
              >
                메시지 보기
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
