"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { MOCK_ARTICLES, TARGET_TYPE_LABELS } from "@/lib/mock-articles";
import ArticleCard from "@/components/article/ArticleCard";

const targetColors: Record<string, string> = {
  all: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  job_seeker: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  hr_manager: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  headhunter: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.id as string;
  const article = MOCK_ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          아티클을 찾을 수 없습니다
        </h1>
        <p className="text-[var(--muted)] mb-6">존재하지 않는 아티클입니다.</p>
        <Link
          href="/articles"
          className="text-primary-600 hover:underline text-sm"
        >
          아티클 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // 관련 아티클: 같은 target_type 중 현재 아티클 제외, 최대 3개
  const related = MOCK_ARTICLES.filter(
    (a) =>
      a.id !== article.id &&
      (a.target_type === article.target_type || a.target_type === "all")
  ).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-6 flex items-center gap-2">
        <Link
          href="/articles"
          className="hover:text-primary-600 transition"
        >
          아티클
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] line-clamp-1">
          {article.title}
        </span>
      </nav>

      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${targetColors[article.target_type]}`}
          >
            {TARGET_TYPE_LABELS[article.target_type]}
          </span>
          <span className="text-xs bg-[var(--muted-bg)] text-[var(--muted)] px-2.5 py-1 rounded-full">
            {article.category}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-[var(--muted)] leading-relaxed mb-4">
          {article.summary}
        </p>

        <div className="flex items-center gap-4 text-sm text-[var(--muted)] border-b border-[var(--card-border)] pb-6">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            {article.published_at}
          </span>
        </div>
      </div>

      {/* 마크다운 본문 */}
      <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)] prose-strong:text-[var(--foreground)] prose-a:text-primary-600 prose-blockquote:border-primary-500 prose-blockquote:text-[var(--muted)] prose-code:bg-[var(--muted-bg)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[var(--muted-bg)] prose-pre:border prose-pre:border-[var(--card-border)] prose-th:text-[var(--foreground)] prose-td:text-[var(--foreground)] prose-li:text-[var(--foreground)]">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </article>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-navy-800 to-primary-700 rounded-2xl p-6 md:p-8 text-center">
        <h3 className="text-lg font-bold text-white mb-2">
          도움이 되셨나요?
        </h3>
        <p className="text-white/70 text-sm mb-4">
          H.Lens에서 실제 리뷰를 확인하고, 나에게 맞는 헤드헌터를 찾아보세요.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/headhunters"
            className="px-6 py-2.5 bg-white text-navy-800 rounded-xl text-sm font-medium hover:bg-gray-100 transition"
          >
            헤드헌터 찾기
          </Link>
          <Link
            href="/reviews/new"
            className="px-6 py-2.5 border border-white/30 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition"
          >
            리뷰 작성하기
          </Link>
        </div>
      </div>

      {/* 관련 아티클 */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-6">
            관련 아티클
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
