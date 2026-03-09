"use client";

import { useState, useMemo } from "react";
import { MOCK_FIRMS, getFirmStats } from "@/lib/mock-data";
import FirmCard from "@/components/firm/FirmCard";

const ALL_SPECIALTIES = Array.from(
  new Set(MOCK_FIRMS.flatMap((f) => f.specialty_fields))
).sort();

type SortKey = "name" | "rating" | "headhunters";

export default function FirmsPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    let list = MOCK_FIRMS.filter((f) => f.status === "active");

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q)
      );
    }

    if (specialty) {
      list = list.filter((f) => f.specialty_fields.includes(specialty));
    }

    list = [...list].sort((a, b) => {
      const sa = getFirmStats(a.id);
      const sb = getFirmStats(b.id);
      if (sort === "rating") return sb.avgRating - sa.avgRating;
      if (sort === "headhunters") return sb.count - sa.count;
      return a.name.localeCompare(b.name, "ko");
    });

    return list;
  }, [search, specialty, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">서치펌 목록</h1>
      <p className="text-[var(--muted)] mb-8">한국에서 활동하는 서치펌을 탐색해보세요.</p>

      {/* 필터 영역 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="서치펌 이름 검색..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
        >
          <option value="">전체 분야</option>
          {ALL_SPECIALTIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
        >
          <option value="rating">평점순</option>
          <option value="headhunters">헤드헌터 수순</option>
          <option value="name">이름순</option>
        </select>
      </div>

      {/* 결과 */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((firm) => (
            <FirmCard key={firm.id} firm={firm} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--muted)]">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
