"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewForm from "@/components/review/ReviewForm";
import type { SearchFirm } from "@/lib/types";
import { MOCK_FIRMS } from "@/lib/mock-data";

export default function EditReviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const reviewId = params.id as string;
  const [ready, setReady] = useState(false);
  const [searchFirms, setSearchFirms] = useState<SearchFirm[]>([]);
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    // 서치펌 + 리뷰 데이터 동시 로드
    Promise.all([
      fetch("/api/search-firms")
        .then((r) => r.json())
        .then((data) => {
          if (data.firms?.length > 0) {
            return data.firms.map((f: { id: string; name: string }) => ({
              id: f.id, name: f.name, website: null, description: null,
              specialty_fields: [], email_domain: null, status: "active" as const, created_at: "",
            }));
          }
          return MOCK_FIRMS;
        })
        .catch(() => MOCK_FIRMS),
      fetch(`/api/reviews/${reviewId}`)
        .then((r) => {
          if (!r.ok) throw new Error("not found");
          return r.json();
        }),
    ]).then(([firms, reviewData]) => {
      setSearchFirms(firms);
      setInitialData(reviewData.review);
      setReady(true);
    }).catch(() => {
      setError("리뷰를 찾을 수 없거나 수정 권한이 없습니다.");
      setReady(true);
    });
  }, [session, status, router, reviewId]);

  if (!ready) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[var(--muted)] mt-4 text-sm">로딩 중...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">{error || "리뷰를 찾을 수 없습니다."}</h2>
        <button onClick={() => router.push("/my")} className="text-primary-600 hover:underline text-sm">
          마이페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">리뷰 수정</h1>
        <p className="text-[var(--muted)] mt-2">
          작성한 리뷰를 수정합니다.
        </p>
      </div>
      <ReviewForm searchFirms={searchFirms} editMode editReviewId={reviewId} editInitialData={initialData} />
    </div>
  );
}
