import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 헤드헌터 프로필 클레임 요청
export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  // 프로필 확인 (헤드헌터 유형만 가능)
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (profile?.user_type !== "headhunter") {
    return NextResponse.json(
      { error: "헤드헌터 유형 사용자만 클레임할 수 있습니다." },
      { status: 403 }
    );
  }

  const { headhunterId, evidenceUrl } = await request.json();

  if (!headhunterId) {
    return NextResponse.json(
      { error: "헤드헌터 ID가 필요합니다." },
      { status: 400 }
    );
  }

  // 이미 클레임된 프로필인지 확인
  const { data: headhunter } = await supabase
    .from("headhunters")
    .select("is_claimed, claimed_by")
    .eq("id", headhunterId)
    .single();

  if (!headhunter) {
    return NextResponse.json(
      { error: "존재하지 않는 헤드헌터입니다." },
      { status: 404 }
    );
  }

  if (headhunter.is_claimed) {
    return NextResponse.json(
      { error: "이미 클레임된 프로필입니다." },
      { status: 409 }
    );
  }

  // 중복 요청 확인
  const { data: existingClaim } = await supabase
    .from("claim_requests")
    .select("id, status")
    .eq("headhunter_id", headhunterId)
    .eq("user_id", user.id)
    .single();

  if (existingClaim) {
    return NextResponse.json(
      { error: `이미 클레임 요청이 ${existingClaim.status === "pending" ? "진행 중" : "처리"}되었습니다.` },
      { status: 409 }
    );
  }

  // 클레임 요청 생성
  const { data: claim, error } = await supabase
    .from("claim_requests")
    .insert({
      headhunter_id: headhunterId,
      user_id: user.id,
      evidence_url: evidenceUrl || null,
    })
    .select()
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

// 헤드헌터 매칭 검색 (이메일/전화번호로)
export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  if (!email && !phone) {
    return NextResponse.json(
      { error: "이메일 또는 전화번호가 필요합니다." },
      { status: 400 }
    );
  }

  let query = supabase
    .from("headhunters")
    .select("id, name, firm_name, is_claimed")
    .eq("is_claimed", false);

  if (email) {
    query = query.eq("email", email);
  }
  if (phone) {
    query = query.eq("phone", phone);
  }

  const { data: matches } = await query;

  return NextResponse.json({ matches: matches || [] });
}
