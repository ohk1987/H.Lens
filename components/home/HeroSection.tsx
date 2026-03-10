"use client";

import Link from "next/link";
import CountUp from "@/components/ui/CountUp";
import { useEffect, useState } from "react";
// TODO: 실제 데이터로 대체 예정
import { MOCK_HEADHUNTERS, MOCK_REVIEWS } from "@/lib/mock-data";

export default function HeroSection() {
  const [stats, setStats] = useState({ reviewCount: 0, headhunterCount: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.reviewCount > 0 || data.headhunterCount > 0) {
          setStats(data);
        } else {
          // DB 데이터가 없으면 mock 데이터 fallback
          setStats({
            reviewCount: MOCK_REVIEWS.length,
            headhunterCount: MOCK_HEADHUNTERS.length,
          });
        }
      })
      .catch(() => {
        // 조회 실패 → mock 데이터 fallback
        setStats({
          reviewCount: MOCK_REVIEWS.length,
          headhunterCount: MOCK_HEADHUNTERS.length,
        });
      });
  }, []);

  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            당신의 커리어를 바꿀
            <br />
            헤드헌터,{" "}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              직접 검증하세요
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-blue-200/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            실제 경험자들의 검증된 리뷰로
            <br className="hidden sm:block" />
            신뢰할 수 있는 커리어 파트너를 선택하세요
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/headhunters"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40"
            >
              헤드헌터 찾기
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/reviews/new"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition"
            >
              리뷰 작성하기
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>

          {/* 신뢰 지표 */}
          <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">
                <CountUp end={stats.reviewCount} suffix="+" />
              </div>
              <div className="text-sm text-blue-300/70 mt-1">누적 리뷰</div>
            </div>
            <div className="text-center border-l border-white/10">
              <div className="text-2xl md:text-3xl font-bold text-white">
                <CountUp end={stats.headhunterCount} suffix="+" />
              </div>
              <div className="text-sm text-blue-300/70 mt-1">등록 헤드헌터</div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 웨이브 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z"
            className="fill-[var(--background)]"
          />
        </svg>
      </div>
    </section>
  );
}
