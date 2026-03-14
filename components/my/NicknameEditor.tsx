"use client";

import { useState } from "react";

interface Props {
  initialNickname: string;
}

export default function NicknameEditor({ initialNickname }: Props) {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(initialNickname);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const trimmed = nickname.trim();
    if (!trimmed || trimmed === initialNickname) {
      setEditing(false);
      setNickname(initialNickname);
      return;
    }

    setSaving(true);
    setError("");

    try {
      // 중복 확인
      const checkRes = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(trimmed)}`);
      const checkData = await checkRes.json();
      if (!checkData.available) {
        setError("이미 사용 중인 닉네임입니다.");
        setSaving(false);
        return;
      }

      // 저장
      const res = await fetch("/api/auth/update-nickname", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmed }),
      });

      if (res.ok) {
        setEditing(false);
        setError("");
      } else {
        const data = await res.json();
        setError(data.error || "닉네임 변경에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-1.5">
        <p className="text-sm text-[var(--muted)]">@{nickname}</p>
        <button
          onClick={() => setEditing(true)}
          className="text-[var(--muted)] hover:text-primary-600 transition"
          title="닉네임 수정"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--muted)]">@</span>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          className="text-sm bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-lg px-2 py-1 text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none w-32"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") { setEditing(false); setNickname(initialNickname); }
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-xs px-2.5 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
        >
          {saving ? "..." : "저장"}
        </button>
        <button
          onClick={() => { setEditing(false); setNickname(initialNickname); setError(""); }}
          className="text-xs px-2 py-1 text-[var(--muted)] hover:text-[var(--foreground)] transition"
        >
          취소
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
