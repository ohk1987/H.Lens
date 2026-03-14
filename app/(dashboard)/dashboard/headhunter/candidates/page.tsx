"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Candidate {
  id: string;
  position_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  nickname: string;
  user_type: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  interest_date: string;
}

interface Position {
  id: string;
  title: string;
  is_active: boolean;
}

const COLUMNS = [
  { key: "pending", label: "관심 표현", color: "bg-blue-500", bgColor: "bg-blue-50 dark:bg-blue-900/10" },
  { key: "active", label: "메시지 중", color: "bg-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-900/10" },
  { key: "reviewing", label: "서류 검토", color: "bg-amber-500", bgColor: "bg-amber-50 dark:bg-amber-900/10" },
  { key: "interview", label: "인터뷰", color: "bg-purple-500", bgColor: "bg-purple-50 dark:bg-purple-900/10" },
  { key: "completed,unmatched", label: "완료/미매칭", color: "bg-gray-500", bgColor: "bg-gray-50 dark:bg-gray-800/30" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "관심 표현" },
  { value: "active", label: "메시지 중" },
  { value: "reviewing", label: "서류 검토" },
  { value: "interview", label: "인터뷰" },
  { value: "completed", label: "완료" },
  { value: "unmatched", label: "미매칭" },
];

const USER_TYPE_LABELS: Record<string, string> = {
  job_seeker: "구직자",
  hr_manager: "HR 담당자",
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function StatusDropdown({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-xs px-2 py-1 rounded border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] transition"
      >
        상태 변경
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg z-20 py-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onStatusChange(opt.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-1.5 text-xs transition ${
                currentStatus === opt.value
                  ? "text-primary-600 font-medium bg-primary-50 dark:bg-primary-900/20"
                  : "text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CandidatesKanbanPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session?.user) { router.push("/login"); return; }
    if (session.user.userType !== "headhunter") { router.push("/my"); return; }

    fetch("/api/dashboard/headhunter/candidates")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setCandidates(d.candidates);
          setPositions(d.positions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, sessionStatus, router]);

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    const prev = candidates.map((c) => ({ ...c }));
    setCandidates((cs) =>
      cs.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
    );

    try {
      const res = await fetch(`/api/conversations/${candidateId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        setCandidates(prev);
      }
    } catch {
      setCandidates(prev);
    }
  };

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDrop = (columnKey: string) => {
    if (!draggedId) return;
    // completed,unmatched 컬럼은 completed로 기본 설정
    const targetStatus = columnKey.includes(",") ? "completed" : columnKey;
    handleStatusChange(draggedId, targetStatus);
    setDraggedId(null);
  };

  const filteredCandidates = selectedPosition === "all"
    ? candidates
    : candidates.filter((c) => c.position_id === selectedPosition);

  if (loading || sessionStatus === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[var(--muted)] text-sm">칸반 보드를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">지원자 관리</h1>
          <p className="text-sm text-[var(--muted)] mt-1">포지션별 지원자 현황을 한눈에 관리하세요</p>
        </div>
        <Link
          href="/dashboard/headhunter"
          className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
        >
          대시보드로 돌아가기
        </Link>
      </div>

      {/* 포지션 필터 탭 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedPosition("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
            selectedPosition === "all"
              ? "bg-primary-600 text-white"
              : "bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          전체
        </button>
        {positions.map((pos) => (
          <button
            key={pos.id}
            onClick={() => setSelectedPosition(pos.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedPosition === pos.id
                ? "bg-primary-600 text-white"
                : "bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {pos.title}
          </button>
        ))}
      </div>

      {/* 칸반 보드 */}
      {filteredCandidates.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-[var(--muted)] mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <p className="text-[var(--muted)]">아직 지원자가 없습니다</p>
          <p className="text-sm text-[var(--muted)] mt-1">포지션에 관심을 표현한 사용자가 여기에 표시됩니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const colKeys = col.key.split(",");
            const colCandidates = filteredCandidates.filter((c) => colKeys.includes(c.status));

            return (
              <div
                key={col.key}
                className={`rounded-xl p-3 min-h-[200px] ${col.bgColor} border border-[var(--card-border)]`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.key)}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">{col.label}</h3>
                  <span className="text-xs text-[var(--muted)] ml-auto">{colCandidates.length}</span>
                </div>

                <div className="space-y-2">
                  {colCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      draggable
                      onDragStart={() => handleDragStart(candidate.id)}
                      className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">{candidate.nickname}</p>
                          <p className="text-xs text-[var(--muted)]">
                            {USER_TYPE_LABELS[candidate.user_type] || candidate.user_type}
                          </p>
                        </div>
                        <StatusDropdown
                          currentStatus={candidate.status}
                          onStatusChange={(s) => handleStatusChange(candidate.id, s)}
                        />
                      </div>

                      <div className="space-y-1 text-xs text-[var(--muted)]">
                        <p>관심 표현: {timeAgo(candidate.interest_date)}</p>
                        {candidate.last_message_at && (
                          <p>마지막 메시지: {timeAgo(candidate.last_message_at)}</p>
                        )}
                      </div>

                      {candidate.unread_count > 0 && (
                        <div className="mt-2">
                          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                            {candidate.unread_count > 9 ? "9+" : candidate.unread_count} 읽지 않음
                          </span>
                        </div>
                      )}

                      <Link
                        href={`/messages/${candidate.id}`}
                        className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-primary-600 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.671 1.09-.086 2.17-.207 3.238-.364 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        메시지 보내기
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
