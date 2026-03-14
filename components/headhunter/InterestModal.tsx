"use client";

import { useState } from "react";

interface Props {
  nickname: string;
  positionTitle?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function InterestModal({ nickname, positionTitle, onConfirm, onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 max-w-sm mx-4 shadow-xl w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full mx-auto mb-4">
          <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>

        {positionTitle && (
          <p className="text-center text-sm font-medium text-primary-600 mb-2">
            {positionTitle}
          </p>
        )}

        <h3 className="text-lg font-semibold text-[var(--foreground)] text-center mb-3">
          관심을 표현하시겠습니까?
        </h3>

        <p className="text-sm text-[var(--muted)] text-center leading-relaxed mb-6">
          관심을 표현하면 헤드헌터가<br />
          <span className="font-medium text-[var(--foreground)]">{nickname}</span>님의 닉네임과 직무/연차 정보를<br />
          확인할 수 있습니다.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm border border-[var(--card-border)] rounded-xl text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition disabled:opacity-50 font-medium"
          >
            {submitting ? "처리 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
