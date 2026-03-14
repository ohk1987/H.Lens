"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  reviewId: string;
}

export default function ReviewActions({ reviewId }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--card-border)]">
        <Link
          href={`/reviews/edit/${reviewId}`}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium transition"
        >
          수정
        </Link>
        <span className="text-xs text-[var(--card-border)]">|</span>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-xs text-red-500 hover:text-red-600 font-medium transition"
        >
          삭제
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">리뷰를 삭제하시겠습니까?</h3>
            <p className="text-sm text-[var(--muted)] mb-6">
              삭제된 리뷰는 복구할 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm border border-[var(--card-border)] rounded-xl text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
