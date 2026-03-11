import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // 1. 헤드헌터 기본 정보 + 서치펌 조인
  const { data: hunter, error: hunterError } = await supabase
    .from("headhunters")
    .select(`
      id,
      name,
      email,
      phone,
      bio,
      search_firm_id,
      is_claimed,
      claimed_by,
      profile_image,
      verification_level,
      created_at,
      search_firms (
        id,
        name,
        website,
        description,
        specialty_fields,
        status,
        created_at
      )
    `)
    .eq("id", id)
    .single();

  if (hunterError || !hunter) {
    console.error("Headhunter fetch error:", hunterError);
    return NextResponse.json({ error: "헤드헌터를 찾을 수 없습니다." }, { status: 404 });
  }

  // 2. 이 헤드헌터의 모든 리뷰 조회
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("headhunter_id", id)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    console.error("Reviews fetch error:", reviewsError);
  }

  const reviewList = reviews || [];

  // 3. 통계 계산
  const reviewCount = reviewList.length;
  const verifiedCount = reviewList.filter((r) => r.review_type === "verified").length;

  // 평균 평점 계산
  let totalRating = 0;
  const avgRatings = {
    professionalism: 0,
    communication: 0,
    reliability: 0,
    support: 0,
    transparency: 0,
  };

  if (reviewCount > 0) {
    for (const r of reviewList) {
      avgRatings.professionalism += r.rating_professionalism;
      avgRatings.communication += r.rating_communication;
      avgRatings.reliability += r.rating_reliability;
      avgRatings.support += r.rating_support;
      avgRatings.transparency += r.rating_transparency;
      totalRating += r.rating_overall;
    }
    (Object.keys(avgRatings) as (keyof typeof avgRatings)[]).forEach((k) => {
      avgRatings[k] = parseFloat((avgRatings[k] / reviewCount).toFixed(1));
    });
    totalRating = parseFloat((totalRating / reviewCount).toFixed(1));
  }

  // trust badge 계산
  let trustBadgeLevel: "none" | "partial" | "full" = "none";
  if (verifiedCount >= 5) trustBadgeLevel = "full";
  else if (verifiedCount >= 1) trustBadgeLevel = "partial";

  const firm = hunter.search_firms as unknown as {
    id: string; name: string; website: string | null;
    description: string | null; specialty_fields: string[];
    status: string; created_at: string;
  } | null;

  // 4. 상위 % 계산 (리뷰 3개 이상인 경우)
  let topPercentage: number | null = null;
  if (reviewCount >= 3) {
    // 전체 헤드헌터의 평균 평점 조회
    const { data: allHunters } = await supabase
      .from("reviews")
      .select("headhunter_id, rating_overall");

    if (allHunters && allHunters.length > 0) {
      // 헤드헌터별 평균 평점 계산
      const hunterAvgs = new Map<string, { sum: number; count: number }>();
      for (const r of allHunters) {
        const existing = hunterAvgs.get(r.headhunter_id) || { sum: 0, count: 0 };
        existing.sum += r.rating_overall;
        existing.count += 1;
        hunterAvgs.set(r.headhunter_id, existing);
      }

      // 리뷰 3개 이상인 헤드헌터만 필터
      const avgScores: number[] = [];
      hunterAvgs.forEach((v) => {
        if (v.count >= 3) avgScores.push(v.sum / v.count);
      });

      if (avgScores.length > 0) {
        const higherCount = avgScores.filter((s) => s > totalRating).length;
        topPercentage = Math.round(((higherCount + 1) / avgScores.length) * 100);
        if (topPercentage < 1) topPercentage = 1;
      }
    }
  }

  // 5. 프론트엔드 인터페이스에 맞게 매핑
  const headhunterData = {
    id: hunter.id,
    name: hunter.name,
    email: hunter.email,
    phone: hunter.phone,
    bio: hunter.bio || null,
    search_firm_id: hunter.search_firm_id,
    firm_name: firm?.name || "소속 없음",
    specialty_fields: firm?.specialty_fields || [],
    total_rating: totalRating,
    review_count: reviewCount,
    verified_review_count: verifiedCount,
    trust_badge_level: trustBadgeLevel,
    linkedin_url: null,
    profile_image: hunter.profile_image,
    claimed_by: hunter.claimed_by,
    is_claimed: hunter.is_claimed,
    verification_level: hunter.verification_level || "none",
    created_at: hunter.created_at,
  };

  // 6. 리뷰 데이터 매핑
  const mappedReviews = reviewList.map((r) => ({
    id: r.id,
    headhunter_id: r.headhunter_id,
    reviewer_id: r.reviewer_id,
    reviewer_type: r.reviewer_type,
    review_type: r.review_type,
    contact_date: r.contact_date,
    contact_channel: r.contact_channel,
    job_field: `${r.industry || ""} / ${r.job_function || ""}`,
    company_size: r.company_size || null,
    career_level: r.career_level || "",
    ratings: {
      professionalism: r.rating_professionalism,
      communication: r.rating_communication,
      reliability: r.rating_reliability,
      support: r.rating_support,
      transparency: r.rating_transparency,
    },
    keywords_positive: r.keywords_positive || [],
    keywords_negative: r.keywords_negative || [],
    content: r.content,
    nps_score: r.rating_overall * 2, // 5점 → 10점 스케일 변환
    headhunter_reply: r.headhunter_reply,
    created_at: r.created_at,
    headhunter_name: hunter.name,
    headhunter_firm: firm?.name || "",
  }));

  // 7. 포지션 목록 조회
  const { data: positions } = await supabase
    .from("headhunter_positions")
    .select("*")
    .eq("headhunter_id", id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    headhunter: headhunterData,
    reviews: mappedReviews,
    avgRatings,
    topPercentage,
    positions: positions || [],
  });
}
