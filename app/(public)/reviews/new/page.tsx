"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewForm from "@/components/review/ReviewForm";
import type { SearchFirm } from "@/lib/types";

// TODO: Supabase에서 로드. 현재는 mock
const MOCK_SEARCH_FIRMS: SearchFirm[] = [
  { id: "1", name: "로버트월터스 코리아", website: null, description: null, specialty_fields: ["IT/개발", "금융"], email_domain: "robertwalters.com", status: "active", created_at: "" },
  { id: "2", name: "마이클페이지 코리아", website: null, description: null, specialty_fields: ["IT/개발", "금융"], email_domain: "michaelpage.com", status: "active", created_at: "" },
  { id: "3", name: "헤이즈 코리아", website: null, description: null, specialty_fields: ["IT/개발", "엔지니어링"], email_domain: "hays.co.kr", status: "active", created_at: "" },
  { id: "4", name: "맨파워그룹 코리아", website: null, description: null, specialty_fields: ["제조", "IT/개발"], email_domain: "manpowergroup.co.kr", status: "active", created_at: "" },
  { id: "5", name: "커리어케어", website: null, description: null, specialty_fields: ["IT/개발", "제조"], email_domain: "careercare.co.kr", status: "active", created_at: "" },
  { id: "6", name: "엘리트 서치", website: null, description: null, specialty_fields: ["IT/개발", "데이터"], email_domain: "elitesearch.co.kr", status: "active", created_at: "" },
  { id: "7", name: "HRK", website: null, description: null, specialty_fields: ["IT/개발", "제조"], email_domain: "hrk.co.kr", status: "active", created_at: "" },
  { id: "8", name: "유니코써치", website: null, description: null, specialty_fields: ["임원", "IT/개발"], email_domain: "unicosearch.com", status: "active", created_at: "" },
  { id: "9", name: "콘페리", website: null, description: null, specialty_fields: ["경영/전략", "임원"], email_domain: "kornferry.com", status: "active", created_at: "" },
  { id: "10", name: "랜스타드 코리아", website: null, description: null, specialty_fields: ["IT/개발", "제조"], email_domain: "randstad.co.kr", status: "active", created_at: "" },
  { id: "11", name: "아이비커리어", website: null, description: null, specialty_fields: ["IT/개발", "스타트업"], email_domain: "ivycareer.co.kr", status: "active", created_at: "" },
  { id: "12", name: "탤런트넷", website: null, description: null, specialty_fields: ["IT/개발", "게임"], email_domain: "talentnet.co.kr", status: "active", created_at: "" },
];

export default function NewReviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login?callbackUrl=/reviews/new");
      return;
    }
    // 헤드헌터 유형은 리뷰 작성 불가
    if (session.user.userType === "headhunter") {
      router.push("/my");
      return;
    }
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
      <ReviewForm searchFirms={MOCK_SEARCH_FIRMS} />
    </div>
  );
}
