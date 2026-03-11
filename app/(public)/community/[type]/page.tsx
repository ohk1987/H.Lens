"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { COMMUNITY_CATEGORIES, COMMUNITY_TYPE_LABELS, COMMUNITY_ACCESS } from "@/lib/community-constants";
import type { CommunityType } from "@/lib/community-constants";
import type { CommunityPost } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "방금 전";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}일 전`;
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export default function CommunityListPage() {
  const params = useParams();
  const type = params.type as CommunityType;
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 준비 중 → 리다이렉트
  const COMMUNITY_OPEN = false;
  useEffect(() => {
    if (!COMMUNITY_OPEN) {
      router.replace("/community");
    }
  }, [router]);

  // 유효한 타입 체크
  const categories = useMemo(() => COMMUNITY_CATEGORIES[type] || [], [type]);
  const communityName = COMMUNITY_TYPE_LABELS[type] || "";

  useEffect(() => {
    if (!COMMUNITY_OPEN) return;
    if (sessionStatus === "loading") return;
    if (!session?.user) {
      router.push(`/login?callbackUrl=/community/${type}`);
      return;
    }
    if (COMMUNITY_ACCESS[type] !== session.user.userType) {
      router.push("/community");
      return;
    }

    async function fetchPosts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ type, page: String(page) });
        if (category) params.set("category", category);
        const res = await fetch(`/api/community/posts?${params}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setTotalPages(data.totalPages);
        }
      } catch {
        console.error("Posts fetch failed");
      }
      setLoading(false);
    }
    fetchPosts();
  }, [type, category, page, session, sessionStatus, router]);

  if (!COMMUNITY_OPEN) return null;

  const categoryLabel = (val: string) => categories.find((c) => c.value === val)?.label || val;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">{communityName}</h1>
        </div>
        <Link
          href={`/community/${type}/write`}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition"
        >
          글쓰기
        </Link>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex items-center gap-1 mb-6 border-b border-[var(--card-border)] overflow-x-auto">
        <button
          onClick={() => { setCategory(""); setPage(1); }}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap ${
            !category
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          전체
        </button>
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => { setCategory(c.value); setPage(1); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap ${
              category === c.value
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-[var(--muted-bg)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[var(--muted-bg)] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${type}/${post.id}`}
              className="block bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 hover:border-primary-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.is_pinned && (
                      <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">공지</span>
                    )}
                    <span className="text-xs text-[var(--muted)] bg-[var(--muted-bg)] px-2 py-0.5 rounded-full">
                      {categoryLabel(post.category)}
                    </span>
                  </div>
                  <h3 className="font-medium text-[var(--foreground)] text-sm truncate">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted)]">
                    <span>{post.nickname}</span>
                    {post.job_function && <span>{post.job_function}</span>}
                    {post.career_level && <span>{post.career_level}</span>}
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {post.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {post.like_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    {post.comment_count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--muted)]">게시글이 없습니다.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-[var(--card-border)] rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-50 transition"
          >
            이전
          </button>
          <span className="text-sm text-[var(--muted)]">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-[var(--card-border)] rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-50 transition"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
