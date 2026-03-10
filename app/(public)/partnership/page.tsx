"use client";

import { useState } from "react";

const PARTNERSHIP_TYPES = [
  {
    type: "서치펌 파트너십",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    benefits: [
      "소속 헤드헌터 프로필 일괄 관리",
      "서치펌 공식 페이지 운영",
      "리뷰 데이터 기반 인사이트 리포트 제공",
      "우수 서치펌 인증 배지 부여",
    ],
  },
  {
    type: "기업 HR 파트너십",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    benefits: [
      "검증된 헤드헌터 추천 리스트 제공",
      "채용 파트너 선정 시 리뷰 데이터 활용",
      "HR 전용 아티클 및 인사이트 우선 제공",
      "기업 채용 브랜딩 페이지 개설",
    ],
  },
  {
    type: "미디어 파트너십",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    benefits: [
      "채용 시장 트렌드 데이터 공유",
      "공동 리서치 및 보고서 발행",
      "콘텐츠 교차 게재 및 프로모션",
      "이벤트 및 세미나 공동 주최",
    ],
  },
];

const FORM_TYPES = ["서치펌 파트너십", "기업 HR 파트너십", "미디어 파트너십", "기타"];

export default function PartnershipPage() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    type: "",
    content: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">제휴 문의</h1>
      <p className="text-[var(--muted)] mb-10">
        H.Lens와 함께 채용 시장의 투명성을 높여갈 파트너를 찾고 있습니다.
      </p>

      {/* 제휴 유형 */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-5">제휴 유형</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PARTNERSHIP_TYPES.map((p) => (
            <div key={p.type} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg flex items-center justify-center mb-3">
                {p.icon}
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-3">{p.type}</h3>
              <ul className="space-y-2">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 제휴 문의 폼 */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-5">제휴 문의하기</h2>

        {submitted ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-8 text-center">
            <div className="w-14 h-14 mx-auto bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">제휴 문의가 접수되었습니다</h3>
            <p className="text-sm text-[var(--muted)]">
              담당자가 검토 후 입력하신 이메일로 연락드리겠습니다.
            </p>
            <button
              onClick={() => { setSubmitted(false); setFormData({ company: "", name: "", email: "", type: "", content: "" }); }}
              className="mt-4 text-sm text-primary-600 hover:underline"
            >
              추가 문의하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">회사명</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="회사명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">담당자명</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="담당자 이름"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">이메일</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="답변 받을 이메일"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">제휴 유형</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">유형을 선택하세요</option>
                  {FORM_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">문의 내용</label>
              <textarea
                required
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="제휴 관련 내용을 자세히 작성해주세요"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition"
            >
              제휴 문의 접수
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
