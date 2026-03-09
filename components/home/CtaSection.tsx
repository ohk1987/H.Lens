"use client";

import Link from "next/link";
import ScrollSection from "@/components/ui/ScrollSection";

export default function CtaSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollSection>
          <div className="hero-gradient rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            {/* 장식 */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                지금 바로 리뷰를 남겨보세요
              </h2>
              <p className="text-blue-200/80 mb-8 max-w-lg mx-auto">
                당신의 경험이 다른 사람의 커리어 선택에 큰 도움이 됩니다.
                <br />
                익명으로 안전하게 작성할 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/reviews/new"
                  className="inline-flex items-center justify-center gap-2 bg-white text-navy-800 px-8 py-3.5 rounded-xl font-semibold transition hover:bg-gray-100"
                >
                  리뷰 작성하기
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition"
                >
                  무료 회원가입
                </Link>
              </div>
            </div>
          </div>
        </ScrollSection>
      </div>
    </section>
  );
}
