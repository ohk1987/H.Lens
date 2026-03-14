"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Conversation {
  id: string;
  position_id: string | null;
  status: string;
  last_message: string | null;
  last_message_at: string;
  unread_count: number;
  other_user: { nickname: string; user_type: string };
  position_title: string | null;
  is_headhunter: boolean;
}

const USER_TYPE_LABELS: Record<string, string> = {
  job_seeker: "구직자",
  hr_manager: "HR 담당자",
  headhunter: "헤드헌터",
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login?callbackUrl=/messages");
      return;
    }

    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setConversations(data.conversations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[var(--muted)] mt-4 text-sm">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">메시지</h1>

      {conversations.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[var(--muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          <p className="text-[var(--muted)] text-sm">아직 메시지가 없습니다.</p>
          <p className="text-[var(--muted)] text-xs mt-1">헤드헌터의 포지션에 관심을 표현하면 대화가 시작됩니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/messages/${conv.id}`}
              className="flex items-center gap-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 hover:bg-[var(--muted-bg)] transition"
            >
              {/* 아바타 */}
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg">
                {conv.other_user.nickname?.charAt(0) || "?"}
              </div>

              {/* 대화 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--foreground)] text-sm truncate">
                    {conv.other_user.nickname}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {USER_TYPE_LABELS[conv.other_user.user_type] || ""}
                  </span>
                  {conv.status === "pending" && (
                    <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">
                      대기
                    </span>
                  )}
                </div>
                {conv.position_title && (
                  <p className="text-xs text-primary-600 truncate mt-0.5">{conv.position_title}</p>
                )}
                <p className="text-sm text-[var(--muted)] truncate mt-0.5">
                  {conv.last_message || "아직 메시지가 없습니다"}
                </p>
              </div>

              {/* 시간 + 미읽음 */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-[var(--muted)]">
                  {formatTime(conv.last_message_at)}
                </span>
                {conv.unread_count > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {conv.unread_count > 9 ? "9+" : conv.unread_count}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
