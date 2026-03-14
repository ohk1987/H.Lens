import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 대화방 메시지 목록 조회
export async function GET(
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
    .select(`
      id, position_id, headhunter_id, participant_id, participant_type, status, created_at
    `)
    .eq("id", conversationId)
    .or(`headhunter_id.eq.${userId},participant_id.eq.${userId}`)
    .single();

  if (!conv) {
    return NextResponse.json({ error: "대화방을 찾을 수 없습니다." }, { status: 404 });
  }

  // 메시지 목록
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, sender_id, content, is_read, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Messages fetch error:", error);
    return NextResponse.json({ error: "메시지를 불러오는데 실패했습니다." }, { status: 500 });
  }

  // 상대방 정보
  const otherUserId = conv.headhunter_id === userId ? conv.participant_id : conv.headhunter_id;
  const { data: otherUser } = await supabase
    .from("users")
    .select("nickname, user_type")
    .eq("id", otherUserId)
    .single();

  // 포지션 정보
  let position = null;
  if (conv.position_id) {
    const { data: pos } = await supabase
      .from("headhunter_positions")
      .select("title, industry, company_size")
      .eq("id", conv.position_id)
      .single();
    position = pos;
  }

  return NextResponse.json({
    conversation: conv,
    messages: messages || [],
    other_user: otherUser || { nickname: "알 수 없음", user_type: "job_seeker" },
    position,
    is_headhunter: conv.headhunter_id === userId,
  });
}

// 메시지 전송
export async function POST(
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
    .select("id, headhunter_id, participant_id, status")
    .eq("id", conversationId)
    .or(`headhunter_id.eq.${userId},participant_id.eq.${userId}`)
    .single();

  if (!conv) {
    return NextResponse.json({ error: "대화방을 찾을 수 없습니다." }, { status: 404 });
  }

  const { content } = await request.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "메시지 내용을 입력해주세요." }, { status: 400 });
  }

  if (content.length > 2000) {
    return NextResponse.json({ error: "메시지는 2000자를 초과할 수 없습니다." }, { status: 400 });
  }

  // 메시지 저장
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: content.trim(),
    })
    .select("id, sender_id, content, is_read, created_at")
    .single();

  if (error) {
    console.error("Message creation error:", error);
    return NextResponse.json({ error: "메시지 전송에 실패했습니다." }, { status: 500 });
  }

  // 대화방 상태 업데이트 (pending → active)
  if (conv.status === "pending" && conv.headhunter_id === userId) {
    await supabase
      .from("conversations")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  } else {
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }

  return NextResponse.json({ message });
}
