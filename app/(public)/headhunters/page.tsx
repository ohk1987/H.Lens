"use client";

import { useState, useMemo, useEffect } from "react";
import type { Headhunter } from "@/lib/types";
import HeadhunterCard from "@/components/headhunter/HeadhunterCard";

type SortKey = "rating" | "reviews" | "recent";

function SkeletonCard() {
  return (
    <div className="border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[var(--muted-bg)] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--muted-bg)] rounded w-24" />
          <div className="h-3 bg-[var(--muted-bg)] rounded w-32" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 bg-[var(--muted-bg)] rounded w-14" />
            <div className="h-5 bg-[var(--muted-bg)] rounded w-14" />
          </div>
          <div className="h-3 bg-[var(--muted-bg)] rounded w-40 mt-2" />
        </div>
      </div>
    </div>
  );
}

export default function HeadhuntersPage() {
  const [headhunters, setHeadhunters] = useState<Headhunter[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/headhunters");
        if (res.ok) {
          const data = await res.json();
          setHeadhunters(data.headhunters || []);
          setSpecialties(data.specialties || []);
        }
      } catch (err) {
        console.error("Failed to fetch headhunters:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let list = [...headhunters];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.firm_name.toLowerCase().includes(q)
      );
    }

    if (specialty) {
      list = list.filter((h) => h.specialty_fields.includes(specialty));
    }

    list.sort((a, b) => {
      if (sort === "rating") return b.total_rating - a.total_rating;
      if (sort === "reviews") return b.review_count - a.review_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [headhunters, search, specialty, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">헤드헌터 목록</h1>
      <p className="text-[var(--muted)] mb-8">리뷰와 평점을 기반으로 헤드헌터를 찾아보세요.</p>

      {/* 필터 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 서치펌 검색..."
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
          <option value="reviews">리뷰 수순</option>
          <option value="recent">최신순</option>
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
          {filtered.map((h) => (
            <HeadhunterCard key={h.id} headhunter={h} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--muted)]">
            {headhunters.length === 0 ? "등록된 헤드헌터가 없습니다." : "검색 결과가 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
}
