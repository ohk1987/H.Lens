import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";
import { awardPoints } from "@/lib/points/award";

export const dynamic = "force-dynamic";

// 리뷰 답글 작성 (1회, 수정 불가)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "headhunter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("users")
    .select("id, status")
    .eq("email", session.user.email)
    .single();

  if (!user || user.status !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: hunter } = await supabase
    .from("headhunters")
    .select("id")
    .eq("claimed_by", user.id)
    .single();

  if (!hunter) {
    return NextResponse.json({ error: "No profile" }, { status: 404 });
  }

  const body = await request.json();
  const { reviewId, content } = body;

  if (!reviewId || !content || content.trim().length < 10) {
    return NextResponse.json({ error: "답글은 최소 10자 이상이어야 합니다." }, { status: 400 });
  }

  if (content.length > 500) {
    return NextResponse.json({ error: "답글은 최대 500자까지 가능합니다." }, { status: 400 });
  }

  // 해당 리뷰가 본인 프로필의 리뷰인지 + 기존 답글이 없는지 확인
  const { data: review } = await supabase
    .from("reviews")
    .select("id, headhunter_id, headhunter_reply")
    .eq("id", reviewId)
    .single();

  if (!review || review.headhunter_id !== hunter.id) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  if (review.headhunter_reply) {
    return NextResponse.json({ error: "이미 답글이 작성되었습니다." }, { status: 400 });
  }

  const { error } = await supabase
    .from("reviews")
    .update({ headhunter_reply: content.trim() })
    .eq("id", reviewId);

  if (error) {
    console.error("Reply update error:", error);
    return NextResponse.json({ error: "답글 작성 실패" }, { status: 500 });
  }

  // 포인트 적립
  awardPoints(user.id, "review_reply", reviewId, "review").catch(() => {});

  return NextResponse.json({ success: true });
}
