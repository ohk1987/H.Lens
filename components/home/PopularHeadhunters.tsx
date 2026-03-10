"use client";

import { useRef, useEffect, useState } from "react";
import HeadhunterCard from "@/components/headhunter/HeadhunterCard";
import ScrollSection from "@/components/ui/ScrollSection";
import type { Headhunter } from "@/lib/types";
// TODO: 실제 데이터로 대체 예정
import { MOCK_HEADHUNTERS } from "@/lib/mock-data";

export default function PopularHeadhunters() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [headhunters, setHeadhunters] = useState<Headhunter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/headhunters");
        if (res.ok) {
          const data = await res.json();
          if (data.headhunters && data.headhunters.length > 0) {
            // 평점순 상위 6명
            const sorted = [...data.headhunters].sort(
              (a: Headhunter, b: Headhunter) => b.total_rating - a.total_rating
            );
            setHeadhunters(sorted.slice(0, 6));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch headhunters:", err);
      }

      // DB 데이터가 없거나 조회 실패 → mock 데이터 fallback
      setHeadhunters(MOCK_HEADHUNTERS);
      setLoading(false);
    }
    fetchData();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollSection>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                인기 헤드헌터
              </h2>
              <p className="text-[var(--muted)] mt-2">
                높은 평점과 많은 리뷰를 받은 검증된 헤드헌터를 만나보세요
              </p>
            </div>
            {/* 스크롤 화살표 (데스크톱) */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center text-[var(--muted)] hover:text-primary-600 hover:border-primary-600 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center text-[var(--muted)] hover:text-primary-600 hover:border-primary-600 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollSection>

        {/* 가로 스크롤 카드 */}
        <ScrollSection delay={150}>
          {loading ? (
            <div className="flex gap-4 overflow-hidden pb-4 -mx-4 px-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[300px] md:w-[340px] border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] p-5 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--muted-bg)] rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[var(--muted-bg)] rounded w-24" />
                      <div className="h-3 bg-[var(--muted-bg)] rounded w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
            >
              {headhunters.map((hh) => (
                <div key={hh.id} className="snap-start flex-shrink-0 w-[300px] md:w-[340px]">
                  <HeadhunterCard headhunter={hh} compact />
                </div>
              ))}
            </div>
          )}
        </ScrollSection>
      </div>
    </section>
  );
}
