import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const conversationId = params.id;
  const userId = session.user.id;

  // 대화방 접근 권한 확인
  const { data: conv } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .or(`headhunter_id.eq.${userId},participant_id.eq.${userId}`)
    .single();

  if (!conv) {
    return NextResponse.json({ error: "대화방을 찾을 수 없습니다." }, { status: 404 });
  }

  // 상대방이 보낸 메시지를 읽음 처리
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Read update error:", error);
    return NextResponse.json({ error: "읽음 처리에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
