import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

// 클레임 요청 생성
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (session.user.userType !== "headhunter") {
    return NextResponse.json(
      { error: "헤드헌터 유형 사용자만 클레임할 수 있습니다." },
      { status: 403 }
    );
  }

  const { headhunterId, evidenceUrl } = await request.json();

  if (!headhunterId) {
    return NextResponse.json({ error: "헤드헌터 ID가 필요합니다." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 이미 클레임된 프로필인지 확인
  const { data: headhunter } = await supabase
    .from("headhunters")
    .select("is_claimed")
    .eq("id", headhunterId)
    .single();

  if (!headhunter) {
    return NextResponse.json({ error: "존재하지 않는 헤드헌터입니다." }, { status: 404 });
  }

  if (headhunter.is_claimed) {
    return NextResponse.json({ error: "이미 클레임된 프로필입니다." }, { status: 409 });
  }

  // 중복 요청 확인
  const { data: existingClaim } = await supabase
    .from("claim_requests")
    .select("id, status")
    .eq("headhunter_id", headhunterId)
    .eq("user_id", session.user.id)
    .single();

  if (existingClaim) {
    return NextResponse.json(
      { error: `이미 클레임 요청이 ${existingClaim.status === "pending" ? "진행 중" : "처리"}되었습니다.` },
      { status: 409 }
    );
  }

  const { data: claim, error } = await supabase
    .from("claim_requests")
    .insert({
      headhunter_id: headhunterId,
      user_id: session.user.id,
      evidence_url: evidenceUrl || null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    claimId: claim.id,
    message: "클레임 요청이 접수되었습니다. 관리자 승인 후 프로필이 연결됩니다.",
  });
}

// 헤드헌터 매칭 검색
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  if (!email && !phone) {
    return NextResponse.json({ error: "이메일 또는 전화번호가 필요합니다." }, { status: 400 });
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("headhunters")
    .select("id, name, is_claimed")
    .eq("is_claimed", false);

  if (email) query = query.eq("email", email);
  if (phone) query = query.eq("phone", phone.replace(/[^0-9]/g, ""));

  const { data: matches } = await query;

  return NextResponse.json({ matches: matches || [] });
}
