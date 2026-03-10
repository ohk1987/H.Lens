"use client";

import { useState, useMemo, useEffect } from "react";
import { MOCK_ARTICLES } from "@/lib/mock-articles";
import type { Article, ArticleTargetType } from "@/lib/types";
import ArticleCard from "@/components/article/ArticleCard";

type TabType = ArticleTargetType | "all_tab";

const TABS: { key: TabType; label: string }[] = [
  { key: "all_tab", label: "전체" },
  { key: "job_seeker", label: "구직자" },
  { key: "hr_manager", label: "HR 담당자" },
  { key: "headhunter", label: "헤드헌터" },
];

export default function ArticlesPage() {
  const [tab, setTab] = useState<TabType>("all_tab");
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);

  useEffect(() => {
    // Supabase에서 아티클 조회 시도, 실패 시 mock 데이터 유지
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            setArticles(data.articles);
          }
        }
      } catch {
        // mock 데이터 유지
      }
    }
    fetchArticles();
  }, []);

  const filtered = useMemo(() => {
    let list = [...articles];

    if (tab !== "all_tab") {
      list = list.filter(
        (a) => a.target_type === tab || a.target_type === "all"
      );
    }

    return list.sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }, [tab, articles]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
        아티클
      </h1>
      <p className="text-[var(--muted)] mb-8">
        채용 시장의 인사이트와 실전 가이드를 확인하세요.
      </p>

      {/* 유형별 탭 */}
      <div className="flex items-center gap-1 mb-8 border-b border-[var(--card-border)] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap ${
              tab === t.key
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 아티클 목록 */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--muted)]">아직 등록된 아티클이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
