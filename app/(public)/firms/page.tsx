"use client";

import { useState, useMemo, useEffect } from "react";
import type { SearchFirm } from "@/lib/types";
import Link from "next/link";

type SortKey = "name" | "rating" | "headhunters";

interface FirmWithStats extends SearchFirm {
  stats: { count: number; avgRating: number; totalReviews: number };
}

function SkeletonCard() {
  return (
    <div className="border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[var(--muted-bg)] rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--muted-bg)] rounded w-32" />
          <div className="h-3 bg-[var(--muted-bg)] rounded w-48" />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="h-5 bg-[var(--muted-bg)] rounded w-14" />
        <div className="h-5 bg-[var(--muted-bg)] rounded w-14" />
      </div>
      <div className="h-3 bg-[var(--muted-bg)] rounded w-40 mt-4" />
    </div>
  );
}

export default function FirmsPage() {
  const [firms, setFirms] = useState<FirmWithStats[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/firms");
        if (res.ok) {
          const data = await res.json();
          setFirms(data.firms || []);
          setSpecialties(data.specialties || []);
        }
      } catch (err) {
        console.error("Failed to fetch firms:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let list = [...firms];

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

    list.sort((a, b) => {
      if (sort === "rating") return b.stats.avgRating - a.stats.avgRating;
      if (sort === "headhunters") return b.stats.count - a.stats.count;
      return a.name.localeCompare(b.name, "ko");
    });

    return list;
  }, [firms, search, specialty, sort]);

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
          {specialties.map((s) => (
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
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((firm) => (
            <Link
              key={firm.id}
              href={`/firms/${firm.id}`}
              className="block border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] card-hover p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-primary-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                  {firm.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--foreground)] truncate">{firm.name}</h3>
                  {firm.description && (
                    <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">{firm.description}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {(firm.specialty_fields || []).map((field) => (
                  <span key={field} className="text-xs bg-[var(--muted-bg)] text-[var(--muted)] px-2 py-0.5 rounded-md">
                    {field}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--card-border)]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <span className="text-sm text-[var(--foreground)] font-medium">{firm.stats.count}명</span>
                  <span className="text-xs text-[var(--muted)]">헤드헌터</span>
                </div>
                {firm.stats.avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold text-[var(--foreground)]">{firm.stats.avgRating}</span>
                  </div>
                )}
                <span className="text-xs text-[var(--muted)]">리뷰 {firm.stats.totalReviews}건</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--muted)]">
            {firms.length === 0 ? "등록된 서치펌이 없습니다." : "검색 결과가 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
}
