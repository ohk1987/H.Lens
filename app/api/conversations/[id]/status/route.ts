import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["pending", "active", "reviewing", "interview", "completed", "unmatched"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "headhunter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const conversationId = params.id;

  const body = await request.json();
  const { status } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "유효하지 않은 상태입니다." },
      { status: 400 }
    );
  }

  // 현재 사용자 조회
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  // 대화 권한 확인 (이 헤드헌터의 대화인지)
  const { data: conv } = await supabase
    .from("conversations")
    .select("id, headhunter_id")
    .eq("id", conversationId)
    .single();

  if (!conv || conv.headhunter_id !== user.id) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { error } = await supabase
    .from("conversations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  if (error) {
    console.error("Conversation status update error:", error);
    return NextResponse.json({ error: "상태 변경에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
