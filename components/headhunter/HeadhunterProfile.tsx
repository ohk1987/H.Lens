"use client";

import { useState, useEffect } from "react";
import { MOCK_HEADHUNTERS, getHeadhunterAvgRatings } from "@/lib/mock-data";
import { RATING_LABELS } from "@/lib/review-constants";
import type { Headhunter, Ratings } from "@/lib/types";
import RatingRadarChart from "./RadarChart";
import Link from "next/link";

interface Props {
  id: string;
}

const badgeConfig = {
  none: { label: "", color: "", icon: "" },
  partial: { label: "부분 인증", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  full: { label: "완전 인증", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

export default function HeadhunterProfile({ id }: Props) {
  const [hunter, setHunter] = useState<Headhunter | null>(null);
  const [avgRatings, setAvgRatings] = useState<Ratings>({
    professionalism: 0, communication: 0, reliability: 0, support: 0, transparency: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // 1. Supabase API에서 조회 시도
      try {
        const res = await fetch(`/api/headhunters/${id}`);
        if (res.ok) {
          const data = await res.json();
          setHunter(data.headhunter);
          setAvgRatings(data.avgRatings);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("API fetch failed, trying mock data:", err);
      }

      // 2. 실패 시 mock 데이터에서 조회
      const mockHunter = MOCK_HEADHUNTERS.find((h) => h.id === id);
      if (mockHunter) {
        setHunter(mockHunter);
        setAvgRatings(getHeadhunterAvgRatings(id));
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[var(--muted)] text-sm">프로필을 불러오는 중...</p>
      </div>
    );
  }

  if (notFound || !hunter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">헤드헌터를 찾을 수 없습니다</h2>
        <Link href="/headhunters" className="text-primary-600 hover:underline text-sm">목록으로 돌아가기</Link>
      </div>
    );
  }

  const badge = badgeConfig[hunter.trust_badge_level];
  const generalCount = hunter.review_count - hunter.verified_review_count;

  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start gap-5">
          {/* 아바타 */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-2xl">
            {hunter.name.charAt(0)}
          </div>

          <div className="flex-1">
            {/* 이름 + 배지 */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">{hunter.name}</h1>
              {hunter.trust_badge_level !== "none" && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.color}`}>
                  {badge.label}
                </span>
              )}
              {hunter.is_claimed && (
                <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-full">
                  클레임 완료
                </span>
              )}
            </div>

            {/* 서치펌 */}
            <p className="text-[var(--muted)] mt-1">
              {hunter.firm_name}
              {hunter.search_firm_id && (
                <Link href={`/firms/${hunter.search_firm_id}`} className="ml-1 text-primary-600 hover:underline text-sm">
                  (상세보기)
                </Link>
              )}
            </p>

            {/* 전문 분야 */}
            {hunter.specialty_fields.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {hunter.specialty_fields.map((f) => (
                  <span key={f} className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2.5 py-1 rounded-full">{f}</span>
                ))}
              </div>
            )}
          </div>

          {/* 통계 */}
          <div className="flex md:flex-col gap-6 md:gap-4 md:text-right">
            <div>
              <div className="flex items-center gap-1 md:justify-end">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-2xl font-bold text-[var(--foreground)]">{hunter.total_rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-[var(--muted)]">종합 평점</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--foreground)]">{hunter.review_count}</p>
              <p className="text-xs text-[var(--muted)]">총 리뷰</p>
            </div>
            <div className="flex gap-3 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                인증 {hunter.verified_review_count}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                일반 {generalCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 레이더 차트 + 항목별 점수 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 레이더 차트 */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">역량 분석</h3>
          <RatingRadarChart ratings={avgRatings} />
        </div>

        {/* 항목별 점수 바 */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">항목별 평점</h3>
          <div className="space-y-4">
            {(Object.keys(RATING_LABELS) as (keyof Ratings)[]).map((key) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--muted)]">{RATING_LABELS[key]}</span>
                  <span className="font-semibold text-[var(--foreground)]">{avgRatings[key]}</span>
                </div>
                <div className="h-2.5 bg-[var(--muted-bg)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${(avgRatings[key] / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
