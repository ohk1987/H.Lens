import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { review_id, report_type, reason } = await request.json();

  if (!review_id || !report_type) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 중복 신고 확인
  const { data: existing } = await supabase
    .from("review_reports")
    .select("id")
    .eq("review_id", review_id)
    .eq("reporter_id", session.user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "이미 신고한 리뷰입니다." }, { status: 409 });
  }

  const { error } = await supabase
    .from("review_reports")
    .insert({
      review_id,
      reporter_id: session.user.id,
      report_type,
      reason: reason || null,
    });

  if (error) {
    console.error("Report creation error:", error);
    return NextResponse.json({ error: "신고 접수에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
