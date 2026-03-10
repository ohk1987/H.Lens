"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { UserType } from "@/lib/types";

const USER_TYPE_OPTIONS: { type: UserType; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    type: "job_seeker",
    label: "구직자로 시작하기",
    desc: "헤드헌터 리뷰를 조회하고 작성할 수 있습니다.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    type: "hr_manager",
    label: "HR 담당자로 시작하기",
    desc: "채용 관점에서 리뷰 작성, HR 전용 평가 항목 이용 가능.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    type: "headhunter",
    label: "헤드헌터로 등록하기",
    desc: "본인 프로필 관리, 리뷰 답변 가능. 관리자 승인 필요.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // user_type 이미 있으면 홈으로
  useEffect(() => {
    if (session?.user?.userType) {
      router.replace("/");
    }
  }, [session, router]);

  if (session?.user?.userType) return null;

  const handleSelect = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType: selected }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다.");
        setLoading(false);
        return;
      }

      // 세션 업데이트
      await update({
        userType: selected,
        status: data.status,
      });

      // HR/헤드헌터는 추가 인증 페이지로
      if (selected === "hr_manager") {
        router.push("/onboarding/hr-verify");
      } else if (selected === "headhunter") {
        router.push("/onboarding/hh-verify");
      } else {
        router.push("/welcome");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">사용자 유형 선택</h1>
          <p className="text-[var(--muted)] mt-2">
            {session?.user?.name || session?.user?.email}님, 어떤 목적으로 H.Lens를 이용하시나요?
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {USER_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setSelected(opt.type)}
              className={`w-full flex items-start gap-4 p-5 rounded-xl border text-left transition ${
                selected === opt.type
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-primary-300"
              }`}
            >
              <div className={`mt-0.5 flex-shrink-0 ${selected === opt.type ? "text-primary-600" : "text-[var(--muted)]"}`}>
                {opt.icon}
              </div>
              <div>
                <p className={`font-semibold ${selected === opt.type ? "text-primary-600" : "text-[var(--foreground)]"}`}>
                  {opt.label}
                </p>
                <p className="text-sm text-[var(--muted)] mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleSelect}
          disabled={!selected || loading}
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? "처리 중..." : "시작하기"}
        </button>
      </div>
    </div>
  );
}
