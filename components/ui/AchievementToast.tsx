"use client";

import { useState, useEffect, useCallback } from "react";

interface ToastItem {
  id: string;
  name: string;
  grade: string;
}

const GRADE_COLORS: Record<string, string> = {
  bronze: "from-amber-600 to-amber-700",
  silver: "from-gray-400 to-gray-500",
  gold: "from-yellow-400 to-yellow-500",
  platinum: "from-purple-500 to-purple-600",
};

const GRADE_LABELS: Record<string, string> = {
  bronze: "브론즈",
  silver: "실버",
  gold: "골드",
  platinum: "플래티넘",
};

export default function AchievementToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const checkNewAchievements = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?_t=" + Date.now());
      if (!res.ok) return;
      const data = await res.json();

      const unreadAchievements = (data.notifications || [])
        .filter(
          (n: { type: string; is_read: boolean }) =>
            n.type === "achievement" && !n.is_read
        )
        .slice(0, 3);

      if (unreadAchievements.length > 0) {
        const newToasts = unreadAchievements.map(
          (n: { id: string; message: string; data: { grade: string } }) => ({
            id: n.id,
            name: n.message,
            grade: n.data?.grade || "bronze",
          })
        );
        setToasts(newToasts);

        // 읽음 처리
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ readAll: true }),
        });

        // 5초 후 자동 제거
        setTimeout(() => setToasts([]), 5000);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // 페이지 로드 시 1회 체크
    const timer = setTimeout(checkNewAchievements, 2000);
    return () => clearTimeout(timer);
  }, [checkNewAchievements]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-lg p-4 flex items-center gap-3 animate-slide-up min-w-[280px]"
        >
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${
              GRADE_COLORS[toast.grade] || GRADE_COLORS.bronze
            } flex items-center justify-center text-white text-lg flex-shrink-0`}
          >
            🏆
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary-600 font-medium">새 업적 달성!</p>
            <p className="text-sm font-bold text-[var(--foreground)] truncate">
              {toast.name}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {GRADE_LABELS[toast.grade] || toast.grade}
            </p>
          </div>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="text-[var(--muted)] hover:text-[var(--foreground)] flex-shrink-0"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
