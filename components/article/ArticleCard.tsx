"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";
import { TARGET_TYPE_LABELS } from "@/lib/mock-articles";

interface Props {
  article: Article;
}

const targetColors: Record<string, string> = {
  all: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  job_seeker: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  hr_manager: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  headhunter: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="block border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] card-hover overflow-hidden"
    >
      {/* 썸네일 */}
      <div className="h-40 bg-gradient-to-br from-navy-700 to-primary-600 flex items-center justify-center p-6">
        <h3 className="text-white font-bold text-base leading-snug line-clamp-3 text-center">
          {article.title}
        </h3>
      </div>

      {/* 콘텐츠 */}
      <div className="p-5">
        {/* 태그 */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${targetColors[article.target_type]}`}>
            {TARGET_TYPE_LABELS[article.target_type]}
          </span>
          <span className="text-xs bg-[var(--muted-bg)] text-[var(--muted)] px-2 py-0.5 rounded-full">
            {article.category}
          </span>
        </div>

        {/* 요약 */}
        <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed mb-3">
          {article.summary}
        </p>

        {/* 메타 */}
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{article.author}</span>
          <span>{article.published_at}</span>
        </div>
      </div>
    </Link>
  );
}
