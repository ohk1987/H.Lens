import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { nickname } = await request.json();

  if (!nickname || typeof nickname !== "string" || nickname.trim().length < 2 || nickname.trim().length > 20) {
    return NextResponse.json({ error: "닉네임은 2~20자 사이여야 합니다." }, { status: 400 });
  }

  const trimmed = nickname.trim();
  const supabase = createAdminClient();

  // 중복 확인
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("nickname", trimmed)
    .neq("id", session.user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 409 });
  }

  const { error } = await supabase
    .from("users")
    .update({ nickname: trimmed })
    .eq("id", session.user.id);

  if (error) {
    console.error("Nickname update error:", error);
    return NextResponse.json({ error: "닉네임 변경에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true, nickname: trimmed });
}
