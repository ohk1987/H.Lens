import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createClient } from "@/lib/supabase/server";
import type { UserType } from "@/lib/types";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { userType } = (await request.json()) as { userType: UserType };

  if (!["job_seeker", "hr_manager", "headhunter"].includes(userType)) {
    return NextResponse.json({ error: "유효하지 않은 사용자 유형입니다." }, { status: 400 });
  }

  const supabase = createClient();

  const status = userType === "headhunter" ? "pending" : "active";

  const { error } = await supabase
    .from("users")
    .update({ user_type: userType, status })
    .eq("email", session.user.email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, status });
}
