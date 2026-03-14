"use client";

import { useState } from "react";
import InterestedPositions from "./InterestedPositions";

interface Props {
  reviewsContent: React.ReactNode;
  achievementsContent: React.ReactNode;
  showInterestedTab: boolean;
}

const TABS = [
  { key: "reviews", label: "내 리뷰" },
  { key: "positions", label: "관심 포지션" },
  { key: "achievements", label: "업적" },
] as const;

export default function MyPageTabs({ reviewsContent, achievementsContent, showInterestedTab }: Props) {
  const [activeTab, setActiveTab] = useState<string>("reviews");

  const tabs = showInterestedTab ? TABS : TABS.filter((t) => t.key !== "positions");

  return (
    <div>
      {/* 탭 네비게이션 */}
      <div className="flex gap-1 mb-6 border-b border-[var(--card-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      {activeTab === "reviews" && (
        <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">내가 작성한 리뷰</h2>
          {reviewsContent}
        </section>
      )}

      {activeTab === "positions" && (
        <section className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">관심 포지션</h2>
          <InterestedPositions />
        </section>
      )}

      {activeTab === "achievements" && achievementsContent}
    </div>
  );
}
