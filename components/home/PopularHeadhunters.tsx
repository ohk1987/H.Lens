"use client";

import { useRef } from "react";
import HeadhunterCard from "@/components/headhunter/HeadhunterCard";
import ScrollSection from "@/components/ui/ScrollSection";
import { MOCK_HEADHUNTERS } from "@/lib/mock-data";

export default function PopularHeadhunters() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          >
            {MOCK_HEADHUNTERS.map((hh) => (
              <div key={hh.id} className="snap-start flex-shrink-0 w-[300px] md:w-[340px]">
                <HeadhunterCard headhunter={hh} compact />
              </div>
            ))}
          </div>
        </ScrollSection>
      </div>
    </section>
  );
}
