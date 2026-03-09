"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ScrollSection from "@/components/ui/ScrollSection";

const SPECIALTY_OPTIONS = [
  { value: "", label: "전체 분야" },
  { value: "it", label: "IT/개발" },
  { value: "finance", label: "금융" },
  { value: "manufacturing", label: "제조" },
  { value: "marketing", label: "마케팅" },
  { value: "other", label: "기타" },
];

const RATING_OPTIONS = [
  { value: "", label: "평점 전체" },
  { value: "4.5", label: "4.5 이상" },
  { value: "4.0", label: "4.0 이상" },
  { value: "3.5", label: "3.5 이상" },
];

export default function SearchBar() {
  const [specialty, setSpecialty] = useState("");
  const [firmName, setFirmName] = useState("");
  const [rating, setRating] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/headhunters");
  };

  return (
    <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
      <ScrollSection>
        <form
          onSubmit={handleSearch}
          className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 md:p-6 shadow-xl shadow-black/5 dark:shadow-black/20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 전문 분야 */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                전문 분야
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border-0 rounded-lg px-4 py-2.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {SPECIALTY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 서치펌명 */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                서치펌명
              </label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="서치펌 이름을 입력하세요"
                className="w-full bg-[var(--muted-bg)] border-0 rounded-lg px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            {/* 평점 필터 */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                최소 평점
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border-0 rounded-lg px-4 py-2.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {RATING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 검색 버튼 */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-2.5 text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                검색
              </button>
            </div>
          </div>
        </form>
      </ScrollSection>
    </section>
  );
}
