"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MOCK_FIRMS, MOCK_HEADHUNTERS, MOCK_REVIEWS, getFirmStats } from "@/lib/mock-data";
import { RATING_LABELS } from "@/lib/review-constants";
import type { Ratings } from "@/lib/types";
import HeadhunterCard from "@/components/headhunter/HeadhunterCard";

export default function FirmDetailPage() {
  const params = useParams();
  const firmId = params.id as string;
  const firm = MOCK_FIRMS.find((f) => f.id === firmId);

  if (!firm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">서치펌을 찾을 수 없습니다</h1>
        <p className="text-[var(--muted)] mb-6">존재하지 않는 서치펌입니다.</p>
        <Link href="/firms" className="text-primary-600 hover:underline text-sm">서치펌 목록으로 돌아가기</Link>
      </div>
    );
  }

  const hunters = MOCK_HEADHUNTERS.filter((h) => h.search_firm_id === firmId);
  const stats = getFirmStats(firmId);

  // 전체 리뷰에서 이 펌 소속 헤드헌터 리뷰만 집계
  const hunterIds = new Set(hunters.map((h) => h.id));
  const firmReviews = MOCK_REVIEWS.filter((r) => hunterIds.has(r.headhunter_id));

  // 종합 평균 ratings
  const avgRatings: Ratings = { professionalism: 0, communication: 0, reliability: 0, support: 0, transparency: 0 };
  if (firmReviews.length > 0) {
    for (const r of firmReviews) {
      (Object.keys(avgRatings) as (keyof Ratings)[]).forEach((k) => { avgRatings[k] += r.ratings[k]; });
    }
    (Object.keys(avgRatings) as (keyof Ratings)[]).forEach((k) => {
      avgRatings[k] = parseFloat((avgRatings[k] / firmReviews.length).toFixed(1));
    });
  }

  // 전문 분야 분포
  const specDistribution: Record<string, number> = {};
  for (const h of hunters) {
    for (const f of h.specialty_fields) {
      specDistribution[f] = (specDistribution[f] || 0) + 1;
    }
  }
  const specEntries = Object.entries(specDistribution).sort((a, b) => b[1] - a[1]);
  const maxSpec = specEntries.length > 0 ? specEntries[0][1] : 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-6 flex items-center gap-2">
        <Link href="/firms" className="hover:text-primary-600 transition">서치펌</Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{firm.name}</span>
      </nav>

      {/* 서치펌 헤더 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-navy-600 to-primary-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
            {firm.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">{firm.name}</h1>
            {firm.description && (
              <p className="text-[var(--muted)] mt-1">{firm.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {firm.specialty_fields.map((f) => (
                <span key={f} className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2.5 py-1 rounded-full">{f}</span>
              ))}
            </div>
            {firm.website && (
              <a href={firm.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline mt-3 inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                웹사이트 방문
              </a>
            )}
          </div>

          {/* 요약 통계 */}
          <div className="flex md:flex-col gap-6 md:gap-3 md:text-right">
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.avgRating > 0 ? stats.avgRating : "-"}</p>
              <p className="text-xs text-[var(--muted)]">평균 평점</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.count}</p>
              <p className="text-xs text-[var(--muted)]">소속 헤드헌터</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.totalReviews}</p>
              <p className="text-xs text-[var(--muted)]">총 리뷰</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 좌측: 종합 점수 + 분포 */}
        <div className="space-y-6">
          {/* 종합 평점 항목별 */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">항목별 종합 점수</h3>
            {firmReviews.length > 0 ? (
              <div className="space-y-3">
                {(Object.keys(RATING_LABELS) as (keyof Ratings)[]).map((key) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--muted)]">{RATING_LABELS[key]}</span>
                      <span className="font-medium text-[var(--foreground)]">{avgRatings[key]}</span>
                    </div>
                    <div className="h-2 bg-[var(--muted-bg)] rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(avgRatings[key] / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">아직 리뷰가 없습니다.</p>
            )}
          </div>

          {/* 전문 분야 분포 */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">전문 분야 분포</h3>
            {specEntries.length > 0 ? (
              <div className="space-y-2.5">
                {specEntries.map(([field, count]) => (
                  <div key={field}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--muted)]">{field}</span>
                      <span className="text-[var(--foreground)] font-medium">{count}명</span>
                    </div>
                    <div className="h-2 bg-[var(--muted-bg)] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(count / maxSpec) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">데이터 없음</p>
            )}
          </div>
        </div>

        {/* 우측: 소속 헤드헌터 */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">소속 헤드헌터 ({hunters.length}명)</h2>
          {hunters.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {hunters.map((h) => (
                <HeadhunterCard key={h.id} headhunter={h} />
              ))}
            </div>
          ) : (
            <div className="bg-[var(--muted-bg)] rounded-xl p-8 text-center">
              <p className="text-[var(--muted)]">등록된 헤드헌터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
