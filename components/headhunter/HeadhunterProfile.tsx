"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MOCK_HEADHUNTERS, getHeadhunterAvgRatings } from "@/lib/mock-data";
import { RATING_LABELS, COMPANY_SIZE_LABELS, HR_EXTRA_RATING_LABELS } from "@/lib/review-constants";
import type { Headhunter, Ratings, VerificationLevel, HeadhunterPosition } from "@/lib/types";
import RatingTrendChart from "./TrendChart";
import Link from "next/link";

interface Props {
  id: string;
}

const RATING_TOOLTIPS: Record<keyof Ratings, string> = {
  professionalism: "직무/산업 이해도, 경력 파악 정확성, 포지션 매칭 적합성",
  communication: "응답 속도, 의사소통 명확성, 질문 답변 충실도",
  reliability: "정보 정확성, 약속 이행, 윤리적 행동",
  support: "이력서/면접 지원, 연봉 협상 조언, 경력 개발 조언",
  transparency: "기업/포지션 정보 제공, 프로세스 진행 공유, 피드백 전달",
};

const verificationConfig: Record<VerificationLevel, { label: string; color: string }> = {
  none: { label: "미인증", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  claimed: { label: "본인 인증", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  verified: { label: "재직 인증", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

function TooltipIcon({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex ml-1 cursor-help">
      <svg className="w-3.5 h-3.5 text-[var(--muted)] hover:text-primary-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
      <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap z-50">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
      </span>
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function HeadhunterProfile({ id }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [hunter, setHunter] = useState<Headhunter | null>(null);
  const [avgRatings, setAvgRatings] = useState<Ratings>({
    professionalism: 0, communication: 0, reliability: 0, support: 0, transparency: 0,
  });
  const [topPercentage, setTopPercentage] = useState<number | null>(null);
  const [trendData, setTrendData] = useState<{ date: string; rating: number }[]>([]);
  const [hrAvgRatings, setHrAvgRatings] = useState<{ feeAdequacy: number; guaranteeSatisfaction: number; contractTerms: number } | null>(null);
  const [positions, setPositions] = useState<HeadhunterPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [interestMap, setInterestMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isHeadhunterOwner = session?.user?.userType === "headhunter" && hunter?.claimed_by === session?.user?.id;
  const showCTA = !isHeadhunterOwner && (session ? session.user?.userType !== "headhunter" : true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/headhunters/${id}`);
        if (res.ok) {
          const data = await res.json();
          setHunter(data.headhunter);
          setAvgRatings(data.avgRatings);
          setTopPercentage(data.topPercentage ?? null);
          setPositions(data.positions || []);
          if (data.reviews) {
            setTrendData(data.reviews.map((r: { created_at: string; nps_score: number }) => ({
              date: r.created_at,
              rating: r.nps_score / 2,
            })));
            // HR 평점 평균 계산
            const hrReviews = data.reviews.filter((r: { reviewer_type: string; hr_rating_fee?: number }) =>
              r.reviewer_type === "hr_manager" && r.hr_rating_fee != null
            );
            if (hrReviews.length > 0) {
              const sum = hrReviews.reduce((acc: { fee: number; guarantee: number; contract: number }, r: { hr_rating_fee: number; hr_rating_guarantee: number; hr_rating_contract: number }) => ({
                fee: acc.fee + (r.hr_rating_fee || 0),
                guarantee: acc.guarantee + (r.hr_rating_guarantee || 0),
                contract: acc.contract + (r.hr_rating_contract || 0),
              }), { fee: 0, guarantee: 0, contract: 0 });
              setHrAvgRatings({
                feeAdequacy: sum.fee / hrReviews.length,
                guaranteeSatisfaction: sum.guarantee / hrReviews.length,
                contractTerms: sum.contract / hrReviews.length,
              });
            }
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("API fetch failed, trying mock data:", err);
      }

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

  // 관심 있어요 토글
  const handleInterest = async (positionId?: string) => {
    if (!session) {
      router.push(`/login?callbackUrl=/headhunters/${id}`);
      return;
    }

    const key = positionId || "__general__";
    const isAlready = interestMap[key];

    try {
      const res = await fetch("/api/headhunters/interest", {
        method: isAlready ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headhunter_id: id,
          position_id: positionId || null,
        }),
      });

      if (res.ok) {
        setInterestMap((prev) => ({ ...prev, [key]: !isAlready }));
        setToastMessage(isAlready ? "관심이 취소되었습니다" : "관심이 등록되었습니다");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
      // ignore
    }
  };

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

  const verificationLevel = hunter.verification_level || "none";
  const vBadge = verificationConfig[verificationLevel];

  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-2xl">
            {hunter.name.charAt(0)}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">{hunter.name}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${vBadge.color}`}>
                {vBadge.label}
              </span>
            </div>

            <p className="text-[var(--muted)] mt-1">
              {hunter.firm_name}
              {hunter.search_firm_id && (
                <Link href={`/firms/${hunter.search_firm_id}`} className="ml-1 text-primary-600 hover:underline text-sm">
                  (기업 정보 보기)
                </Link>
              )}
            </p>

            {hunter.specialty_fields.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {hunter.specialty_fields.map((f) => (
                  <span key={f} className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2.5 py-1 rounded-full">{f}</span>
                ))}
              </div>
            )}

            {showCTA && (
              <Link
                href={session ? `/reviews/new?headhunter_id=${hunter.id}` : `/login?callbackUrl=/reviews/new?headhunter_id=${hunter.id}`}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                이 헤드헌터 리뷰 작성하기
              </Link>
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
              {topPercentage !== null && (
                <p className="text-xs font-medium text-primary-600 mt-0.5">
                  전체 헤드헌터 중 상위 {topPercentage}%
                </p>
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--foreground)]">{hunter.review_count}</p>
              <p className="text-xs text-[var(--muted)]">전체 리뷰 수</p>
            </div>
          </div>
        </div>
      </div>

      {/* 추이 차트 + 항목별 점수 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">평점 추이</h3>
          <RatingTrendChart reviews={trendData} />
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">항목별 평점</h3>
          <div className="space-y-4">
            {(Object.keys(RATING_LABELS) as (keyof Ratings)[]).map((key) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--muted)] flex items-center">
                    {RATING_LABELS[key]}
                    <TooltipIcon text={RATING_TOOLTIPS[key]} />
                  </span>
                  <span className="font-semibold text-[var(--foreground)]">{avgRatings[key].toFixed(1)}</span>
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

          {/* HR 담당자 평가 */}
          {hrAvgRatings && (
            <div className="mt-6 pt-5 border-t border-[var(--card-border)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                  HR 담당자
                </span>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">HR 담당자 평가</h4>
              </div>
              <div className="space-y-4">
                {(Object.keys(HR_EXTRA_RATING_LABELS) as (keyof typeof HR_EXTRA_RATING_LABELS)[]).map((key) => {
                  const ratingValue = key === "feeAdequacy" ? hrAvgRatings.feeAdequacy
                    : key === "guaranteeSatisfaction" ? hrAvgRatings.guaranteeSatisfaction
                    : hrAvgRatings.contractTerms;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[var(--muted)]">{HR_EXTRA_RATING_LABELS[key]}</span>
                        <span className="font-semibold text-[var(--foreground)]">{ratingValue.toFixed(1)}</span>
                      </div>
                      <div className="h-2.5 bg-[var(--muted-bg)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${(ratingValue / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* 현재 진행 중인 포지션 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">현재 진행 중인 포지션</h3>
        {positions.length > 0 ? (
          <div className="space-y-3">
            {positions.map((pos) => (
              <div key={pos.id} className="border border-[var(--card-border)] rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)]">{pos.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-[var(--muted)]">
                      <span>{pos.industry}</span>
                      <span>·</span>
                      <span>{COMPANY_SIZE_LABELS[pos.company_size] || pos.company_size}</span>
                      <span>·</span>
                      <span>경력 {pos.career_min}~{pos.career_max}년</span>
                    </div>
                    {pos.description && (
                      <p className="text-sm text-[var(--muted)] mt-2">{pos.description}</p>
                    )}
                    <p className="text-xs text-[var(--muted)] mt-2">{formatDate(pos.created_at)}</p>
                  </div>
                  {!isHeadhunterOwner && (
                    <button
                      onClick={() => handleInterest(pos.id)}
                      className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                        interestMap[pos.id]
                          ? "bg-primary-600 text-white border border-primary-600"
                          : "text-primary-600 border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                      }`}
                    >
                      {interestMap[pos.id] ? "관심 취소" : "관심 있어요"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)] text-center py-6">등록된 포지션이 없습니다</p>
        )}
      </div>
    </div>
  );
}
