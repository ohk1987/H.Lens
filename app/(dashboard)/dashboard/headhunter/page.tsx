"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COMPANY_SIZES, COMPANY_SIZE_LABELS } from "@/lib/review-constants";

interface DashboardData {
  headhunter: {
    id: string;
    name: string;
    bio: string | null;
    firm_name: string;
    specialty_fields: string[];
    verification_level: string;
    profile_image: string | null;
  };
  stats: {
    totalRating: number;
    reviewCount: number;
    topPercentage: number | null;
    unrepliedCount: number;
  };
  recentReviews: {
    id: string;
    reviewer_type: string;
    review_type: string;
    rating_overall: number;
    content: string;
    headhunter_reply: string | null;
    created_at: string;
    job_field: string;
  }[];
  positions: {
    id: string;
    title: string;
    industry: string;
    company_size: string;
    career_min: number;
    career_max: number;
    description: string | null;
    is_active: boolean;
    interest_count: number;
    created_at: string;
  }[];
  contacts: {
    id: string;
    position_id: string | null;
    position_title: string | null;
    user_nickname: string;
    user_type: string;
    created_at: string;
  }[];
}

const verificationConfig: Record<string, { label: string; color: string }> = {
  none: { label: "미인증", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  claimed: { label: "본인 인증", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  verified: { label: "재직 인증", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const reviewerTypeLabel: Record<string, string> = {
  job_seeker: "구직자",
  hr_manager: "HR 담당자",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function HeadhunterDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  // 포지션 폼
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [posForm, setPosForm] = useState({ title: "", industry: "", company_size: "", career_min: 0, career_max: 0, description: "" });
  const [posSubmitting, setPosSubmitting] = useState(false);

  // 답글 폼
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (session.user.userType !== "headhunter") {
      router.push("/my");
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/headhunter");
        if (res.status === 403) {
          const d = await res.json();
          setPendingStatus(d.status || "pending");
          setLoading(false);
          return;
        }
        if (res.status === 404) {
          setError("no_profile");
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error("fetch failed");
        const d = await res.json();
        setData(d);
      } catch {
        setError("fetch_error");
      }
      setLoading(false);
    }
    fetchData();
  }, [session, sessionStatus, router]);

  // 포지션 추가
  const handleAddPosition = async () => {
    if (!posForm.title || !posForm.industry || !posForm.company_size) return;
    setPosSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/headhunter/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(posForm),
      });
      if (res.ok) {
        const { position } = await res.json();
        setData((prev) => prev ? { ...prev, positions: [position, ...prev.positions] } : prev);
        setPosForm({ title: "", industry: "", company_size: "", career_min: 0, career_max: 0, description: "" });
        setShowPositionForm(false);
      } else {
        const d = await res.json();
        alert(d.error || "등록 실패");
      }
    } catch {
      alert("네트워크 오류");
    }
    setPosSubmitting(false);
  };

  // 포지션 활성/비활성 토글
  const handleTogglePosition = async (id: string, currentActive: boolean) => {
    const res = await fetch("/api/dashboard/headhunter/positions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !currentActive }),
    });
    if (res.ok) {
      setData((prev) => prev ? {
        ...prev,
        positions: prev.positions.map((p) => p.id === id ? { ...p, is_active: !currentActive } : p),
      } : prev);
    }
  };

  // 포지션 삭제
  const handleDeletePosition = async (id: string) => {
    if (!confirm("이 포지션을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/dashboard/headhunter/positions?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => prev ? {
        ...prev,
        positions: prev.positions.filter((p) => p.id !== id),
      } : prev);
    }
  };

  // 답글 작성
  const handleReply = async (reviewId: string) => {
    if (replyContent.trim().length < 10) return;
    setReplySubmitting(true);
    try {
      const res = await fetch("/api/dashboard/headhunter/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, content: replyContent }),
      });
      if (res.ok) {
        setData((prev) => prev ? {
          ...prev,
          recentReviews: prev.recentReviews.map((r) =>
            r.id === reviewId ? { ...r, headhunter_reply: replyContent } : r
          ),
          stats: { ...prev.stats, unrepliedCount: prev.stats.unrepliedCount - 1 },
        } : prev);
        setReplyingTo(null);
        setReplyContent("");
      } else {
        const d = await res.json();
        alert(d.error || "답글 작성 실패");
      }
    } catch {
      alert("네트워크 오류");
    }
    setReplySubmitting(false);
  };

  // 로딩
  if (loading || sessionStatus === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[var(--muted)] text-sm">대시보드를 불러오는 중...</p>
      </div>
    );
  }

  // 미승인 안내
  if (pendingStatus) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8">
          <svg className="w-16 h-16 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-2">승인 대기 중</h2>
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            헤드헌터 계정 승인이 완료되면 대시보드를 이용하실 수 있습니다.<br />
            승인은 1~2 영업일 이내 처리됩니다.
          </p>
          <Link href="/my" className="inline-block mt-6 px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition">
            마이페이지로 이동
          </Link>
        </div>
      </div>
    );
  }

  // 에러
  if (error === "no_profile") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">헤드헌터 프로필 없음</h2>
        <p className="text-[var(--muted)] text-sm mb-6">
          먼저 헤드헌터 프로필을 등록해주세요.
        </p>
        <Link href="/headhunter-register" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition">
          프로필 등록하기
        </Link>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--muted)]">데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const { headhunter, stats, recentReviews, positions, contacts } = data;
  const vBadge = verificationConfig[headhunter.verification_level] || verificationConfig.none;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">내 대시보드</h1>
        <Link
          href="/dashboard/headhunter/edit"
          className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
        >
          프로필 편집
        </Link>
      </div>

      {/* 상단 - 내 프로필 현황 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
            {headhunter.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-[var(--foreground)]">{headhunter.name}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${vBadge.color}`}>{vBadge.label}</span>
            </div>
            <p className="text-sm text-[var(--muted)] mt-1">{headhunter.firm_name}</p>
            {headhunter.bio && (
              <p className="text-sm text-[var(--foreground)] mt-2">{headhunter.bio}</p>
            )}
          </div>
          <div className="flex gap-6 sm:gap-8">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-2xl font-bold text-[var(--foreground)]">{stats.totalRating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-[var(--muted)]">평점</p>
              {stats.topPercentage !== null && (
                <p className="text-xs font-medium text-primary-600">상위 {stats.topPercentage}%</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.reviewCount}</p>
              <p className="text-xs text-[var(--muted)]">리뷰</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.unrepliedCount}</p>
              <p className="text-xs text-[var(--muted)]">미답글</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href={`/headhunters/${headhunter.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            내 프로필 보기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 중단: 리뷰 + 포지션 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* 최근 리뷰 */}
        <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">최근 리뷰</h3>
          {recentReviews.length > 0 ? (
            <div className="space-y-3">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className={`border rounded-xl p-4 ${
                    !review.headhunter_reply
                      ? "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10"
                      : "border-[var(--card-border)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        review.review_type === "verified"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {review.review_type === "verified" ? "인증" : "일반"}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {reviewerTypeLabel[review.reviewer_type] || review.reviewer_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold">{review.rating_overall.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--foreground)] line-clamp-2 mb-2">{review.content}</p>
                  <p className="text-xs text-[var(--muted)]">{formatDate(review.created_at)}</p>

                  {/* 답글 상태 */}
                  {review.headhunter_reply ? (
                    <div className="mt-3 bg-[var(--muted-bg)] rounded-lg p-3">
                      <p className="text-xs text-[var(--muted)] mb-1">내 답글</p>
                      <p className="text-sm text-[var(--foreground)] line-clamp-2">{review.headhunter_reply}</p>
                    </div>
                  ) : (
                    <div className="mt-3">
                      {replyingTo === review.id ? (
                        <div>
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] resize-none h-20 focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="답글을 작성해주세요. (최소 10자, 1회 작성, 수정 불가)"
                            maxLength={500}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-[var(--muted)]">{replyContent.length}/500</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setReplyingTo(null); setReplyContent(""); }}
                                className="px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition"
                              >
                                취소
                              </button>
                              <button
                                onClick={() => handleReply(review.id)}
                                disabled={replySubmitting || replyContent.trim().length < 10}
                                className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition disabled:opacity-50"
                              >
                                {replySubmitting ? "제출 중..." : "답글 등록"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setReplyingTo(review.id); setReplyContent(""); }}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          답글 작성
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] text-center py-6">아직 받은 리뷰가 없습니다.</p>
          )}
        </section>

        {/* 포지션 관리 */}
        <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--foreground)]">포지션 관리</h3>
            {positions.length < 5 && (
              <button
                onClick={() => setShowPositionForm(!showPositionForm)}
                className="text-xs px-3 py-1.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                {showPositionForm ? "취소" : "추가"}
              </button>
            )}
          </div>

          {/* 포지션 추가 폼 */}
          {showPositionForm && (
            <div className="border border-[var(--card-border)] rounded-xl p-4 mb-4 space-y-3">
              <input
                type="text"
                value={posForm.title}
                onChange={(e) => setPosForm({ ...posForm, title: e.target.value })}
                placeholder="포지션명 (필수)"
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <input
                type="text"
                value={posForm.industry}
                onChange={(e) => setPosForm({ ...posForm, industry: e.target.value })}
                placeholder="산업군 (필수)"
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <div>
                <p className="text-xs text-[var(--muted)] mb-1.5">기업 구분 (필수)</p>
                <div className="flex flex-wrap gap-2">
                  {COMPANY_SIZES.map((cs) => (
                    <button
                      key={cs.value}
                      onClick={() => setPosForm({ ...posForm, company_size: cs.value })}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        posForm.company_size === cs.value
                          ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                          : "border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
                      }`}
                    >
                      {cs.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-[var(--muted)]">최소 경력(년)</label>
                  <input
                    type="number"
                    min={0}
                    value={posForm.career_min}
                    onChange={(e) => setPosForm({ ...posForm, career_min: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-[var(--muted)]">최대 경력(년)</label>
                  <input
                    type="number"
                    min={0}
                    value={posForm.career_max}
                    onChange={(e) => setPosForm({ ...posForm, career_max: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <textarea
                value={posForm.description}
                onChange={(e) => setPosForm({ ...posForm, description: e.target.value })}
                placeholder="상세 설명 (선택)"
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] resize-none h-16 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button
                onClick={handleAddPosition}
                disabled={posSubmitting || !posForm.title || !posForm.industry || !posForm.company_size}
                className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
              >
                {posSubmitting ? "등록 중..." : "포지션 등록"}
              </button>
              <p className="text-xs text-[var(--muted)] text-center">{positions.length}/5개 등록됨</p>
            </div>
          )}

          {/* 포지션 목록 */}
          {positions.length > 0 ? (
            <div className="space-y-3">
              {positions.map((pos) => (
                <div key={pos.id} className={`border rounded-xl p-4 ${pos.is_active ? "border-[var(--card-border)]" : "border-[var(--card-border)] opacity-60"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-[var(--foreground)]">{pos.title}</h4>
                        {!pos.is_active && (
                          <span className="text-xs text-[var(--muted)] bg-[var(--muted-bg)] px-2 py-0.5 rounded-full">비활성</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-[var(--muted)]">
                        <span>{pos.industry}</span>
                        <span>·</span>
                        <span>{COMPANY_SIZE_LABELS[pos.company_size] || pos.company_size}</span>
                        <span>·</span>
                        <span>경력 {pos.career_min}~{pos.career_max}년</span>
                      </div>
                      {pos.interest_count > 0 && (
                        <p className="text-xs text-primary-600 mt-1">관심 {pos.interest_count}명</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => handleTogglePosition(pos.id, pos.is_active)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          pos.is_active
                            ? "border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            : "border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        }`}
                      >
                        {pos.is_active ? "비활성" : "활성화"}
                      </button>
                      <button
                        onClick={() => handleDeletePosition(pos.id)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] text-center py-6">등록된 포지션이 없습니다.</p>
          )}
        </section>
      </div>

      {/* 하단 - 컨택 요청 */}
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">컨택 요청</h3>
        {contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between border border-[var(--card-border)] rounded-xl p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-[var(--foreground)]">{contact.user_nickname}</span>
                    <span className="text-xs text-[var(--muted)]">
                      {reviewerTypeLabel[contact.user_type] || contact.user_type}
                    </span>
                  </div>
                  {contact.position_title && (
                    <p className="text-xs text-[var(--muted)] mt-1">관심 포지션: {contact.position_title}</p>
                  )}
                  <p className="text-xs text-[var(--muted)] mt-0.5">{formatDate(contact.created_at)}</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium text-primary-600 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition">
                  연락하기
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)] text-center py-6">아직 컨택 요청이 없습니다.</p>
        )}
      </section>
    </div>
  );
}
