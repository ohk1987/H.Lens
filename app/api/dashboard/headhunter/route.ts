import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "headhunter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // 사용자 상태 확인
  const { data: user } = await supabase
    .from("users")
    .select("id, status")
    .eq("email", session.user.email)
    .single();

  if (!user || user.status !== "active") {
    return NextResponse.json({ error: "not_active", status: user?.status || "pending" }, { status: 403 });
  }

  // 이 사용자가 claim한 헤드헌터 프로필 찾기
  const { data: hunter } = await supabase
    .from("headhunters")
    .select(`
      id, name, email, phone, bio, search_firm_id, is_claimed, claimed_by,
      profile_image, verification_level, created_at,
      search_firms ( id, name, specialty_fields )
    `)
    .eq("claimed_by", user.id)
    .single();

  if (!hunter) {
    return NextResponse.json({ error: "no_profile" }, { status: 404 });
  }

  const firm = hunter.search_firms as unknown as { id: string; name: string; specialty_fields: string[] } | null;

  // 리뷰 조회
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("headhunter_id", hunter.id)
    .order("created_at", { ascending: false });

  const reviewList = reviews || [];
  const reviewCount = reviewList.length;

  // 평균 평점
  let totalRating = 0;
  if (reviewCount > 0) {
    for (const r of reviewList) {
      totalRating += r.rating_overall;
    }
    totalRating = parseFloat((totalRating / reviewCount).toFixed(1));
  }

  // 상위 % 계산
  let topPercentage: number | null = null;
  if (reviewCount >= 3) {
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("headhunter_id, rating_overall");

    if (allReviews && allReviews.length > 0) {
      const hunterAvgs = new Map<string, { sum: number; count: number }>();
      for (const r of allReviews) {
        const existing = hunterAvgs.get(r.headhunter_id) || { sum: 0, count: 0 };
        existing.sum += r.rating_overall;
        existing.count += 1;
        hunterAvgs.set(r.headhunter_id, existing);
      }
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

  // 최근 5개 리뷰 매핑
  const recentReviews = reviewList.slice(0, 5).map((r) => ({
    id: r.id,
    reviewer_type: r.reviewer_type,
    review_type: r.review_type,
    rating_overall: r.rating_overall,
    content: r.content,
    headhunter_reply: r.headhunter_reply,
    created_at: r.created_at,
    job_field: `${r.industry || ""} / ${r.job_function || ""}`,
  }));

  // 포지션 목록
  const { data: positions } = await supabase
    .from("headhunter_positions")
    .select("*")
    .eq("headhunter_id", hunter.id)
    .order("created_at", { ascending: false });

  // 컨택 목록 (관심 있어요)
  const { data: contacts } = await supabase
    .from("headhunter_contacts")
    .select(`
      id, position_id, created_at,
      users ( id, nickname, user_type ),
      headhunter_positions ( id, title )
    `)
    .eq("headhunter_id", hunter.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    headhunter: {
      id: hunter.id,
      name: hunter.name,
      bio: hunter.bio,
      firm_name: firm?.name || "소속 없음",
      specialty_fields: firm?.specialty_fields || [],
      verification_level: hunter.verification_level || "none",
      profile_image: hunter.profile_image,
    },
    stats: {
      totalRating,
      reviewCount,
      topPercentage,
      unrepliedCount: reviewList.filter((r) => !r.headhunter_reply).length,
    },
    recentReviews,
    positions: positions || [],
    contacts: (contacts || []).map((c) => {
      const u = c.users as unknown as { id: string; nickname: string; user_type: string } | null;
      const p = c.headhunter_positions as unknown as { id: string; title: string } | null;
      return {
        id: c.id,
        position_id: c.position_id,
        position_title: p?.title || null,
        user_nickname: u?.nickname || "익명",
        user_type: u?.user_type || "",
        created_at: c.created_at,
      };
    }),
  });
}
