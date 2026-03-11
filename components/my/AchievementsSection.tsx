"use client";

import { useState, useEffect } from "react";

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  target_type: string;
  grade: string;
  condition_value: number;
  icon: string;
  achieved: boolean;
  achieved_at: string | null;
  is_displayed: boolean;
  current_value: number;
}

type GradeFilter = "all" | "bronze" | "silver" | "gold" | "platinum";

const GRADE_COLORS: Record<string, string> = {
  bronze: "from-amber-600 to-amber-700",
  silver: "from-gray-400 to-gray-500",
  gold: "from-yellow-400 to-yellow-500",
  platinum: "from-purple-500 to-purple-600",
};

const GRADE_BG: Record<string, string> = {
  bronze: "bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700",
  silver: "bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
  gold: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700",
  platinum: "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700",
};

const GRADE_LABELS: Record<string, string> = {
  bronze: "브론즈",
  silver: "실버",
  gold: "골드",
  platinum: "플래티넘",
};

const GRADE_FILTERS: { key: GradeFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "bronze", label: "브론즈" },
  { key: "silver", label: "실버" },
  { key: "gold", label: "골드" },
  { key: "platinum", label: "플래티넘" },
];

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch("/api/achievements");
        if (res.ok) {
          const data = await res.json();
          setAchievements(data.achievements);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }
    fetchAchievements();
  }, []);

  const handleToggleDisplay = async (achievementId: string, currentDisplayed: boolean) => {
    setTogglingId(achievementId);
    try {
      const res = await fetch("/api/achievements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievementId, isDisplayed: !currentDisplayed }),
      });
      if (res.ok) {
        setAchievements((prev) =>
          prev.map((a) =>
            a.id === achievementId ? { ...a, is_displayed: !currentDisplayed } : a
          )
        );
      } else {
        const d = await res.json();
        alert(d.error || "변경 실패");
      }
    } catch {
      // ignore
    }
    setTogglingId(null);
  };

  const filtered = gradeFilter === "all"
    ? achievements
    : achievements.filter((a) => a.grade === gradeFilter);

  const achievedCount = achievements.filter((a) => a.achieved).length;
  const displayedCount = achievements.filter((a) => a.is_displayed).length;

  // 등급 순서
  const gradeOrder: Record<string, number> = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
  const sorted = [...filtered].sort((a, b) => {
    // 달성 여부 먼저 (달성 먼저)
    if (a.achieved !== b.achieved) return a.achieved ? -1 : 1;
    // 등급 순
    return (gradeOrder[a.grade] || 99) - (gradeOrder[b.grade] || 99);
  });

  if (loading) {
    return (
      <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">업적</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-[var(--muted-bg)] rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          업적 <span className="text-sm font-normal text-[var(--muted)]">{achievedCount}/{achievements.length}</span>
        </h2>
        <span className="text-xs text-[var(--muted)]">
          대표 배지: {displayedCount}/3
        </span>
      </div>

      {/* 등급 필터 */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        {GRADE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setGradeFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full border transition whitespace-nowrap ${
              gradeFilter === f.key
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                : "border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 업적 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sorted.map((a) => (
          <div
            key={a.id}
            className={`relative rounded-xl p-4 border transition ${
              a.achieved
                ? GRADE_BG[a.grade] || GRADE_BG.bronze
                : "bg-[var(--muted-bg)] border-[var(--card-border)] opacity-50"
            }`}
          >
            {/* 배지 아이콘 */}
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                  a.achieved
                    ? `bg-gradient-to-br ${GRADE_COLORS[a.grade] || GRADE_COLORS.bronze}`
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {a.achieved ? "🏆" : "🔒"}
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                a.achieved ? "text-[var(--foreground)]" : "text-[var(--muted)]"
              }`}>
                {GRADE_LABELS[a.grade]}
              </span>
            </div>

            <h4 className="text-xs font-bold text-[var(--foreground)] mb-0.5 truncate">{a.name}</h4>
            <p className="text-[10px] text-[var(--muted)] line-clamp-2 mb-2">{a.description}</p>

            {/* 진행도 */}
            {!a.achieved && a.condition_value > 1 && (
              <div>
                <div className="flex justify-between text-[10px] text-[var(--muted)] mb-0.5">
                  <span>{a.current_value}/{a.condition_value}</span>
                </div>
                <div className="h-1.5 bg-[var(--card-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (a.current_value / a.condition_value) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* 달성 시 대표 배지 토글 */}
            {a.achieved && (
              <button
                onClick={() => handleToggleDisplay(a.id, a.is_displayed)}
                disabled={togglingId === a.id}
                className={`mt-2 w-full text-[10px] py-1 rounded-lg border transition ${
                  a.is_displayed
                    ? "border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20"
                    : "border-[var(--card-border)] text-[var(--muted)] hover:border-primary-300"
                }`}
              >
                {a.is_displayed ? "대표 배지 해제" : "대표 배지로 설정"}
              </button>
            )}
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-center text-sm text-[var(--muted)] py-8">해당 등급의 업적이 없습니다.</p>
      )}
    </section>
  );
}
