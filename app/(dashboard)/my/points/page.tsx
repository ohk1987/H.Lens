"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Transaction {
  id: string;
  points: number;
  transaction_type: string;
  description: string;
  reference_type: string | null;
  created_at: string;
}

const FILTER_OPTIONS = [
  { key: "all", label: "전체" },
  { key: "earned", label: "적립" },
  { key: "spent", label: "차감" },
];

export default function PointsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [totalPoints, setTotalPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session?.user) { router.push("/login"); return; }

    fetch("/api/my/points/total")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setTotalPoints(d.total_points))
      .catch(() => {});
  }, [session, sessionStatus, router]);

  useEffect(() => {
    if (sessionStatus === "loading" || !session?.user) return;
    setLoading(true);

    fetch(`/api/my/points?filter=${filter}&page=${page}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setTransactions(d.transactions);
          setTotalPages(d.totalPages);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, sessionStatus, filter, page]);

  if (sessionStatus === "loading") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/my" className="text-[var(--muted)] hover:text-[var(--foreground)] transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">포인트 내역</h1>
      </div>

      {/* 총 포인트 */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 mb-6 text-center">
        <p className="text-sm text-amber-700 dark:text-amber-400 mb-1">보유 포인트</p>
        <p className="text-4xl font-bold text-amber-600 dark:text-amber-300">
          {totalPoints.toLocaleString()} <span className="text-xl">P</span>
        </p>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-4">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => { setFilter(opt.key); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === opt.key
                ? "bg-primary-600 text-white"
                : "bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 내역 목록 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--muted)] text-sm">포인트 내역이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--card-border)]">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{tx.description}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {new Date(tx.created_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>
                <span className={`text-sm font-bold ${
                  tx.points > 0 ? "text-emerald-600" : "text-red-500"
                }`}>
                  {tx.points > 0 ? "+" : ""}{tx.points.toLocaleString()}P
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-40 transition"
          >
            이전
          </button>
          <span className="px-3 py-1.5 text-sm text-[var(--muted)]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-40 transition"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
