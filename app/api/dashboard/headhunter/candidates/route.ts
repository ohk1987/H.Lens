import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "headhunter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // 현재 사용자의 헤드헌터 프로필 조회
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  // 헤드헌터 프로필 조회
  const { data: hunter } = await supabase
    .from("headhunters")
    .select("id")
    .eq("claimed_by", user.id)
    .single();

  if (!hunter) {
    return NextResponse.json({ error: "헤드헌터 프로필이 없습니다." }, { status: 404 });
  }

  // 포지션 목록 조회
  const { data: positions } = await supabase
    .from("headhunter_positions")
    .select("id, title, is_active")
    .eq("headhunter_id", hunter.id)
    .order("created_at", { ascending: false });

  // 대화 목록 조회 (이 헤드헌터의 모든 대화)
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, position_id, participant_id, status, created_at, updated_at")
    .eq("headhunter_id", user.id)
    .order("updated_at", { ascending: false });

  if (!conversations || conversations.length === 0) {
    return NextResponse.json({ positions: positions || [], candidates: [] });
  }

  // 참여자 정보 조회
  const participantIds = Array.from(new Set(conversations.map((c) => c.participant_id)));
  const { data: participants } = await supabase
    .from("users")
    .select("id, nickname, user_type")
    .in("id", participantIds);

  const participantMap = new Map(
    (participants || []).map((p) => [p.id, p])
  );

  // 각 대화의 마지막 메시지 및 미읽은 메시지 수 조회
  const candidateList = [];
  for (const conv of conversations) {
    const participant = participantMap.get(conv.participant_id);

    // 마지막 메시지
    const { data: lastMsg } = await supabase
      .from("messages")
      .select("content, created_at")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // 미읽은 메시지 수
    const { count: unreadCount } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("conversation_id", conv.id)
      .neq("sender_id", user.id)
      .eq("is_read", false);

    // 관심 표현일 (headhunter_contacts에서 조회)
    const { data: contact } = await supabase
      .from("headhunter_contacts")
      .select("created_at")
      .eq("headhunter_id", hunter.id)
      .eq("user_id", conv.participant_id)
      .limit(1)
      .single();

    candidateList.push({
      id: conv.id,
      position_id: conv.position_id,
      status: conv.status,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      nickname: participant?.nickname || "알 수 없음",
      user_type: participant?.user_type || "job_seeker",
      last_message: lastMsg?.content || null,
      last_message_at: lastMsg?.created_at || null,
      unread_count: unreadCount || 0,
      interest_date: contact?.created_at || conv.created_at,
    });
  }

  return NextResponse.json({
    positions: positions || [],
    candidates: candidateList,
  });
}
