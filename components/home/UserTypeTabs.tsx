"use client";

import { useState } from "react";
import ScrollSection from "@/components/ui/ScrollSection";

const TABS = [
  {
    id: "job_seeker",
    label: "구직자",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "나에게 맞는 헤드헌터를 찾으세요",
    features: [
      {
        title: "검증된 리뷰 확인",
        desc: "실제 구직 경험자들의 솔직한 리뷰를 통해 헤드헌터의 전문성과 신뢰도를 미리 파악하세요.",
      },
      {
        title: "5가지 세부 평가",
        desc: "전문성, 소통력, 신뢰성, 코칭 능력, 투명성을 다각도로 평가한 상세 리포트를 확인하세요.",
      },
      {
        title: "분야별 전문가 매칭",
        desc: "IT, 금융, 제조 등 분야별 전문 헤드헌터를 필터링하여 최적의 파트너를 찾으세요.",
      },
    ],
  },
  {
    id: "hr_manager",
    label: "HR 담당자",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    title: "신뢰할 수 있는 채용 파트너를 선별하세요",
    features: [
      {
        title: "헤드헌터 성과 데이터",
        desc: "구직자들의 실제 피드백을 기반으로 헤드헌터의 추천 정확도와 프로세스 효율성을 확인하세요.",
      },
      {
        title: "인증 리뷰 시스템",
        desc: "실제 컨택이 인증된 리뷰를 우선 확인하여 더 정확한 판단을 내릴 수 있습니다.",
      },
      {
        title: "채용 전략 인사이트",
        desc: "헤드헌터별 전문 분야와 강점을 파악하여 채용 니즈에 맞는 최적의 파트너를 선택하세요.",
      },
    ],
  },
  {
    id: "headhunter",
    label: "헤드헌터",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: "전문성을 어필하고 신뢰를 구축하세요",
    features: [
      {
        title: "프로필 브랜딩",
        desc: "전문 분야, 경력, 성과를 체계적으로 정리한 프로필로 구직자와 기업에게 신뢰를 전달하세요.",
      },
      {
        title: "리뷰 피드백 관리",
        desc: "받은 리뷰에 답변을 달고 피드백을 반영하여 서비스 품질을 지속적으로 개선하세요.",
      },
      {
        title: "신뢰 배지 획득",
        desc: "인증 리뷰가 누적되면 신뢰 배지를 획득하여 더 많은 구직자와 기업의 선택을 받으세요.",
      },
    ],
  },
];

export default function UserTypeTabs() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <section className="py-16 md:py-20 bg-[var(--muted-bg)]">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              모든 사용자를 위한 플랫폼
            </h2>
            <p className="text-[var(--muted)] mt-2">
              당신이 누구든, H.Lens가 도움을 드립니다
            </p>
          </div>
        </ScrollSection>

        <ScrollSection delay={100}>
          {/* 탭 버튼 */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1.5">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                    i === active
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollSection>

        {/* 탭 내용 */}
        <ScrollSection delay={200}>
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 md:p-10">
            <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-8">
              {tab.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {tab.features.map((f, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center text-primary-600 mb-4">
                    <span className="text-lg font-bold">{i + 1}</span>
                  </div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-2">{f.title}</h4>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>
      </div>
    </section>
  );
}
