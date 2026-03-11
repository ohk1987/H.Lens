import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "유효한 이메일을 입력해주세요." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("community_waitlist")
    .insert({ email: email.toLowerCase().trim() });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "이미 신청된 이메일입니다." }, { status: 409 });
    }
    console.error("Waitlist insert error:", error);
    return NextResponse.json({ error: "신청 실패" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
