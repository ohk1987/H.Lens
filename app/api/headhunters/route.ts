import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  // 헤드헌터 + 서치펌 조인
  const { data: hunters, error } = await supabase
    .from("headhunters")
    .select(`
      id,
      name,
      email,
      phone,
      search_firm_id,
      is_claimed,
      claimed_by,
      profile_image,
      verification_level,
      created_at,
      search_firms (
        id,
        name,
        specialty_fields
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Headhunters list error:", error);
    return NextResponse.json({ headhunters: [] });
  }

  // 전체 리뷰 조회 (헤드헌터별 통계 계산용)
  const { data: allReviews } = await supabase
    .from("reviews")
    .select("headhunter_id, rating_overall, review_type");

  const reviewsByHunter = new Map<string, { count: number; verifiedCount: number; totalRating: number }>();
  for (const r of allReviews || []) {
    const existing = reviewsByHunter.get(r.headhunter_id) || { count: 0, verifiedCount: 0, totalRating: 0 };
    existing.count += 1;
    existing.totalRating += r.rating_overall;
    if (r.review_type === "verified") existing.verifiedCount += 1;
    reviewsByHunter.set(r.headhunter_id, existing);
  }

  const result = (hunters || []).map((h) => {
    const firm = h.search_firms as unknown as { id: string; name: string; specialty_fields: string[] } | null;
    const stats = reviewsByHunter.get(h.id) || { count: 0, verifiedCount: 0, totalRating: 0 };
    const avgRating = stats.count > 0 ? parseFloat((stats.totalRating / stats.count).toFixed(1)) : 0;

    let trustBadgeLevel: "none" | "partial" | "full" = "none";
    if (stats.verifiedCount >= 5) trustBadgeLevel = "full";
    else if (stats.verifiedCount >= 1) trustBadgeLevel = "partial";

    return {
      id: h.id,
      name: h.name,
      search_firm_id: h.search_firm_id,
      firm_name: firm?.name || "소속 없음",
      specialty_fields: firm?.specialty_fields || [],
      total_rating: avgRating,
      review_count: stats.count,
      verified_review_count: stats.verifiedCount,
      trust_badge_level: trustBadgeLevel,
      linkedin_url: null,
      profile_image: h.profile_image,
      phone: h.phone,
      email: h.email,
      claimed_by: h.claimed_by,
      is_claimed: h.is_claimed,
      verification_level: h.verification_level || "none",
      created_at: h.created_at,
    };
  });

  // 전문 분야 목록 추출
  const specialtySet = new Set<string>();
  result.forEach((h) => h.specialty_fields.forEach((s: string) => specialtySet.add(s)));
  const specialties = Array.from(specialtySet).sort();

  return NextResponse.json({ headhunters: result, specialties });
}
