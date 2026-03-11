"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { COMMUNITY_TYPE_LABELS, COMMUNITY_CATEGORIES } from "@/lib/community-constants";
import type { CommunityType } from "@/lib/community-constants";
import type { CommunityPost, CommunityComment } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function CommunityPostPage() {
  const params = useParams();
  const type = params.type as CommunityType;
  const postId = params.id as string;
  const { data: session } = useSession();
  const router = useRouter();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [userLiked, setUserLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // 준비 중 → 리다이렉트
  const COMMUNITY_OPEN = false;
  useEffect(() => {
    if (!COMMUNITY_OPEN) {
      router.replace("/community");
    }
  }, [router]);

  useEffect(() => {
    if (!COMMUNITY_OPEN) return;
    async function fetchPost() {
      try {
        const res = await fetch(`/api/community/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
          setComments(data.comments);
          setUserLiked(data.userLiked);
        } else {
          router.push(`/community/${type}`);
        }
      } catch {
        router.push(`/community/${type}`);
      }
      setLoading(false);
    }
    fetchPost();
  }, [postId, type, router]);

  const handleLike = async () => {
    if (!session?.user || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setUserLiked(data.liked);
        setPost((prev) => prev ? { ...prev, like_count: data.like_count } : prev);
      }
    } catch { /* ignore */ }
    setLikeLoading(false);
  };

  const handleComment = async () => {
    if (!commentText.trim() || commentSubmitting) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setPost((prev) => prev ? { ...prev, comment_count: prev.comment_count + 1 } : prev);
        setCommentText("");
      } else {
        const data = await res.json();
        alert(data.error || "댓글 작성 실패");
      }
    } catch { /* ignore */ }
    setCommentSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/community/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      router.push(`/community/${type}`);
    }
  };

  if (!COMMUNITY_OPEN || loading) return null;
  if (!post) return null;

  const categories = COMMUNITY_CATEGORIES[type] || [];
  const categoryLabel = categories.find((c) => c.value === post.category)?.label || post.category;
  const communityName = COMMUNITY_TYPE_LABELS[type] || "";
  const isAuthor = session?.user?.email && post.author_id; // 간략화 - 실제로는 ID 비교 필요

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 뒤로가기 */}
      <Link
        href={`/community/${type}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {communityName}
      </Link>

      {/* 게시글 */}
      <article className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-[var(--muted-bg)] text-[var(--muted)] px-2 py-0.5 rounded-full">{categoryLabel}</span>
        </div>

        <h1 className="text-xl font-bold text-[var(--foreground)] mb-4">{post.title}</h1>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]">{post.nickname}</span>
            {post.job_function && <span>{post.job_function}</span>}
            {post.career_level && <span>{post.career_level}</span>}
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            <span>{formatDate(post.created_at)}</span>
            <span>조회 {post.view_count}</span>
          </div>
        </div>

        {/* 본문 */}
        <div className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap mb-6">
          {post.content}
        </div>

        {/* 하단 액션 */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)]">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={!session?.user || likeLoading}
              className={`flex items-center gap-1.5 text-sm transition ${
                userLiked ? "text-red-500" : "text-[var(--muted)] hover:text-red-500"
              } disabled:opacity-50`}
            >
              <svg className="w-5 h-5" fill={userLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {post.like_count}
            </button>
            <span className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              {post.comment_count}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthor && (
              <button onClick={handleDelete} className="text-xs text-[var(--muted)] hover:text-red-500 transition">
                삭제
              </button>
            )}
            <button className="text-xs text-[var(--muted)] hover:text-red-500 transition flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
              신고
            </button>
          </div>
        </div>
      </article>

      {/* 댓글 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-4">댓글 {comments.length}개</h3>

        {comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-[var(--card-border)] pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">{comment.nickname}</span>
                  <span className="text-xs text-[var(--muted)]">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">{comment.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button className="text-xs text-[var(--muted)] hover:text-red-500 flex items-center gap-1 transition">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {comment.like_count > 0 && comment.like_count}
                  </button>
                  <button className="text-xs text-[var(--muted)] hover:text-red-500 transition">신고</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)] text-center py-4 mb-4">아직 댓글이 없습니다.</p>
        )}

        {/* 댓글 작성 */}
        {session?.user ? (
          <div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 작성해주세요."
              maxLength={1000}
              className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] resize-none h-20 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-[var(--muted)]">{commentText.length}/1000</span>
              <button
                onClick={handleComment}
                disabled={commentSubmitting || !commentText.trim()}
                className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition disabled:opacity-50"
              >
                {commentSubmitting ? "작성 중..." : "댓글 등록"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Link href={`/login?callbackUrl=/community/${type}/${postId}`} className="text-sm text-primary-600 hover:underline">
              로그인하고 댓글 작성하기
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
