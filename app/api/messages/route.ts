import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const userId = session.user.id;

  // 내가 참여한 대화방 조회 (헤드헌터 or 참여자)
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`
      id,
      position_id,
      headhunter_id,
      participant_id,
      participant_type,
      status,
      created_at,
      updated_at
    `)
    .or(`headhunter_id.eq.${userId},participant_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Conversations fetch error:", error);
    return NextResponse.json({ error: "대화방 목록을 불러오는데 실패했습니다." }, { status: 500 });
  }

  // 각 대화방의 마지막 메시지, 읽지 않은 수, 상대방 정보 조회
  const enriched = await Promise.all(
    (conversations || []).map(async (conv) => {
      // 마지막 메시지
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, created_at, sender_id")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // 읽지 않은 메시지 수
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .neq("sender_id", userId)
        .eq("is_read", false);

      // 상대방 정보
      const otherUserId = conv.headhunter_id === userId ? conv.participant_id : conv.headhunter_id;
      const { data: otherUser } = await supabase
        .from("users")
        .select("nickname, user_type")
        .eq("id", otherUserId)
        .single();

      // 포지션 정보
      let positionTitle = null;
      if (conv.position_id) {
        const { data: pos } = await supabase
          .from("headhunter_positions")
          .select("title")
          .eq("id", conv.position_id)
          .single();
        positionTitle = pos?.title || null;
      }

      return {
        ...conv,
        last_message: lastMsg?.content || null,
        last_message_at: lastMsg?.created_at || conv.created_at,
        unread_count: unreadCount || 0,
        other_user: otherUser || { nickname: "알 수 없음", user_type: "job_seeker" },
        position_title: positionTitle,
        is_headhunter: conv.headhunter_id === userId,
      };
    })
  );

  return NextResponse.json({ conversations: enriched });
}
