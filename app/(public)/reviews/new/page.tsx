"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewForm from "@/components/review/ReviewForm";
import type { SearchFirm } from "@/lib/types";

export default function NewReviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [searchFirms, setSearchFirms] = useState<SearchFirm[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login?callbackUrl=/reviews/new");
      return;
    }
    if (session.user.userType === "headhunter") {
      router.push("/my");
      return;
    }

    // 서치펌 목록 로드
    fetch("/api/search-firms")
      .then((r) => r.json())
      .then((data) => {
        if (data.firms?.length > 0) {
          setSearchFirms(data.firms.map((f: { id: string; name: string }) => ({
            id: f.id,
            name: f.name,
            website: null,
            description: null,
            specialty_fields: [],
            email_domain: null,
            status: "active" as const,
            created_at: "",
          })));
        }
      })
      .catch(() => {});

    setReady(true);
  }, [session, status, router]);

  if (!ready) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[var(--muted)] mt-4 text-sm">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">리뷰 작성</h1>
        <p className="text-[var(--muted)] mt-2">
          헤드헌터와의 경험을 공유해주세요. 모든 리뷰는 <strong>익명</strong>으로 처리됩니다.
        </p>
      </div>
      <ReviewForm searchFirms={searchFirms} />
    </div>
  );
}
