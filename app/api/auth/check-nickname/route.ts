import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { nickname } = await request.json();

  if (!nickname || typeof nickname !== "string") {
    return NextResponse.json({ available: false, error: "닉네임을 입력해주세요." });
  }

  const trimmed = nickname.trim();

  // 2~10자, 한글/영문/숫자만
  if (!/^[가-힣a-zA-Z0-9]{2,10}$/.test(trimmed)) {
    return NextResponse.json({
      available: false,
      error: "2~10자의 한글, 영문, 숫자만 사용 가능합니다.",
    });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("nickname", trimmed)
    .maybeSingle();

  return NextResponse.json({
    available: !data,
    error: data ? "이미 사용 중인 닉네임입니다." : null,
  });
}
