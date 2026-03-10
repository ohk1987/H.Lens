import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  const { data: firms, error } = await supabase
    .from("search_firms")
    .select("*")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("Firms list error:", error);
    return NextResponse.json({ firms: [] });
  }

  // 전체 헤드헌터 + 리뷰 조회 (서치펌별 통계 계산)
  const { data: hunters } = await supabase
    .from("headhunters")
    .select("id, search_firm_id");

  const { data: reviews } = await supabase
    .from("reviews")
    .select("headhunter_id, rating_overall");

  // 헤드헌터별 평균 평점
  const hunterRatings = new Map<string, { sum: number; count: number }>();
  for (const r of reviews || []) {
    const existing = hunterRatings.get(r.headhunter_id) || { sum: 0, count: 0 };
    existing.sum += r.rating_overall;
    existing.count += 1;
    hunterRatings.set(r.headhunter_id, existing);
  }

  // 서치펌별 통계
  const firmStats = new Map<string, { hunterCount: number; totalRating: number; ratingCount: number; reviewCount: number }>();
  for (const h of hunters || []) {
    if (!h.search_firm_id) continue;
    const existing = firmStats.get(h.search_firm_id) || { hunterCount: 0, totalRating: 0, ratingCount: 0, reviewCount: 0 };
    existing.hunterCount += 1;
    const hr = hunterRatings.get(h.id);
    if (hr) {
      existing.totalRating += hr.sum;
      existing.ratingCount += hr.count;
      existing.reviewCount += hr.count;
    }
    firmStats.set(h.search_firm_id, existing);
  }

  const result = (firms || []).map((f) => {
    const stats = firmStats.get(f.id) || { hunterCount: 0, totalRating: 0, ratingCount: 0, reviewCount: 0 };
    return {
      ...f,
      stats: {
        count: stats.hunterCount,
        avgRating: stats.ratingCount > 0 ? parseFloat((stats.totalRating / stats.ratingCount).toFixed(1)) : 0,
        totalReviews: stats.reviewCount,
      },
    };
  });

  // 전문 분야 목록 추출
  const specialtySet = new Set<string>();
  result.forEach((f) => (f.specialty_fields || []).forEach((s: string) => specialtySet.add(s)));
  const specialties = Array.from(specialtySet).sort();

  return NextResponse.json({ firms: result, specialties });
}
