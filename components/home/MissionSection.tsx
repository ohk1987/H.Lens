"use client";

import Link from "next/link";
import ScrollSection from "@/components/ui/ScrollSection";

export default function MissionSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollSection>
          <div className="bg-navy-800/50 dark:bg-navy-900/50 border border-navy-700/30 rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-4">
                헤드헌팅 시장의 투명성을 만듭니다
              </h2>
              <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
                실제 경험자들의 검증된 리뷰로 신뢰할 수 있는
                <br className="hidden sm:block" />
                헤드헌터를 찾고, 건강한 채용 생태계를 함께 만들어갑니다.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-400 text-sm font-medium transition"
              >
                H.Lens 소개 더 보기
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </ScrollSection>
      </div>
    </section>
  );
}
