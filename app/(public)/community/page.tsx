"use client";

import { useState } from "react";
import { COMMUNITY_INFO } from "@/lib/community-constants";
import type { CommunityType } from "@/lib/community-constants";

const communityTypes: CommunityType[] = ["job_seeker", "hr_manager", "headhunter"];

const icons: Record<string, React.ReactNode> = {
  briefcase: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  building: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  star: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
};

export default function CommunityPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/community/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "신청에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* 메인 타이틀 */}
      <div className="text-center mb-12">
        <p className="text-4xl mb-4">🚀</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          곧 오픈합니다
        </h1>
        <p className="text-lg text-[var(--muted)] leading-relaxed">
          이직, 채용, 헤드헌팅 업계 종사자들을 위한<br />
          커뮤니티가 준비 중입니다
        </p>
      </div>

      {/* 이메일 알림 신청 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-2 text-center">
          오픈 알림 받기
        </h2>
        <p className="text-sm text-[var(--muted)] text-center mb-4">
          커뮤니티가 오픈되면 이메일로 알려드립니다.
        </p>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
              신청이 완료되었습니다! 오픈 시 알려드리겠습니다.
            </p>
          </div>
        ) : (
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소 입력"
              className="flex-1 bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !email.trim()}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50 flex-shrink-0"
            >
              {submitting ? "신청 중..." : "알림 신청"}
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center mt-2">{error}</p>
        )}
      </div>

      {/* 커뮤니티 미리보기 카드 */}
      <div className="grid md:grid-cols-3 gap-5">
        {communityTypes.map((type) => {
          const info = COMMUNITY_INFO[type];
          return (
            <div
              key={type}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 text-center opacity-75"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600">
                {icons[info.icon]}
              </div>
              <h3 className="font-bold text-[var(--foreground)] mb-2">{info.name}</h3>
              <p className="text-sm text-[var(--muted)]">{info.desc}</p>
              <div className="mt-4 px-4 py-2 bg-[var(--muted-bg)] rounded-lg text-xs text-[var(--muted)] font-medium">
                준비 중
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
