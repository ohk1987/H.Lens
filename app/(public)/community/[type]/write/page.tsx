"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { COMMUNITY_CATEGORIES, COMMUNITY_TYPE_LABELS, COMMUNITY_ACCESS } from "@/lib/community-constants";
import { JOB_FUNCTIONS, SENIORITY_LEVELS } from "@/lib/review-constants";
import type { CommunityType } from "@/lib/community-constants";

export default function CommunityWritePage() {
  const params = useParams();
  const type = params.type as CommunityType;
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [jobFunction, setJobFunction] = useState("");
  const [careerLevel, setCareerLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 준비 중 → 리다이렉트
  const COMMUNITY_OPEN = false;
  useEffect(() => {
    if (!COMMUNITY_OPEN) {
      router.replace("/community");
    }
  }, [router]);

  const categories = useMemo(() => COMMUNITY_CATEGORIES[type] || [], [type]);
  const communityName = COMMUNITY_TYPE_LABELS[type] || "";

  useEffect(() => {
    if (!COMMUNITY_OPEN) return;
    if (sessionStatus === "loading") return;
    if (!session?.user) {
      router.push(`/login?callbackUrl=/community/${type}/write`);
      return;
    }
    if (COMMUNITY_ACCESS[type] !== session.user.userType) {
      router.push("/community");
    }
  }, [type, session, sessionStatus, router]);

  const handleSubmit = async () => {
    if (!category || !title.trim() || !content.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          community_type: type,
          category,
          title: title.trim(),
          content: content.trim(),
          job_function: jobFunction || null,
          career_level: careerLevel || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/community/${type}/${data.post.id}`);
      } else {
        const data = await res.json();
        alert(data.error || "작성 실패");
      }
    } catch {
      alert("네트워크 오류");
    }
    setSubmitting(false);
  };

  if (!COMMUNITY_OPEN) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/community/${type}`} className="text-[var(--muted)] hover:text-[var(--foreground)] transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{communityName} 글쓰기</h1>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 space-y-5">
        {/* 카테고리 */}
        <div>
          <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  category === c.value
                    ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 작성자 정보 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">직무 (선택)</label>
            <select
              value={jobFunction}
              onChange={(e) => setJobFunction(e.target.value)}
              className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--foreground)]"
            >
              <option value="">선택 안함</option>
              {JOB_FUNCTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">연차 (선택)</label>
            <select
              value={careerLevel}
              onChange={(e) => setCareerLevel(e.target.value)}
              className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--foreground)]"
            >
              <option value="">선택 안함</option>
              {SENIORITY_LEVELS.map((s) => (
                <option key={s.value} value={s.label}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="제목을 입력해주세요"
            className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <p className="text-xs text-[var(--muted)] text-right mt-1">{title.length}/100</p>
        </div>

        {/* 본문 */}
        <div>
          <label className="text-sm font-medium text-[var(--foreground)] mb-1 block">본문</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={5000}
            placeholder="내용을 입력해주세요"
            className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] resize-none h-60 focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <p className="text-xs text-[var(--muted)] text-right mt-1">{content.length}/5000</p>
        </div>

        {/* 제출 */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href={`/community/${type}`}
            className="px-5 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
          >
            취소
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting || !category || !title.trim() || !content.trim()}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
          >
            {submitting ? "작성 중..." : "작성 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
