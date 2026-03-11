import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";
import type { UserType } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { userType, nickname } = (await request.json()) as { userType: UserType; nickname?: string };

  if (!["job_seeker", "hr_manager", "headhunter"].includes(userType)) {
    return NextResponse.json({ error: "유효하지 않은 사용자 유형입니다." }, { status: 400 });
  }

  // 닉네임 유효성 검사
  const trimmedNickname = nickname?.trim();
  if (trimmedNickname) {
    if (!/^[가-힣a-zA-Z0-9]{2,10}$/.test(trimmedNickname)) {
      return NextResponse.json({ error: "닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다." }, { status: 400 });
    }
  }

  const supabase = createAdminClient();

  // 닉네임 중복 확인
  if (trimmedNickname) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("nickname", trimmedNickname)
      .neq("email", session.user.email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 409 });
    }
  }

  const status = userType === "headhunter" ? "pending" : "active";

  const updateData: Record<string, unknown> = { user_type: userType, status };
  if (trimmedNickname) {
    updateData.nickname = trimmedNickname;
  }

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("email", session.user.email)
    .select("id")
    .single();

  if (error) {
    console.error("Onboarding update error:", error);
    return NextResponse.json({ error: "사용자 유형 저장에 실패했습니다." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ success: true, status });
}
