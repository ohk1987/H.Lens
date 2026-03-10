import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("users")
    .update({ is_welcomed: true })
    .eq("id", session.user.id);

  if (error) {
    console.error("Welcome update error:", error);
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
