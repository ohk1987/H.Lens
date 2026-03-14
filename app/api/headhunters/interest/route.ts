import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { headhunter_id, position_id } = body;

  if (!headhunter_id) {
    return NextResponse.json({ error: "헤드헌터 ID가 필요합니다." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 이미 등록 여부 확인
  let query = supabase
    .from("headhunter_contacts")
    .select("id")
    .eq("headhunter_id", headhunter_id)
    .eq("user_id", session.user.id);

  if (position_id) {
    query = query.eq("position_id", position_id);
  } else {
    query = query.is("position_id", null);
  }

  const { data: existing } = await query.maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "이미 관심 등록되었습니다." }, { status: 409 });
  }

  const { error } = await supabase
    .from("headhunter_contacts")
    .insert({
      headhunter_id,
      user_id: session.user.id,
      position_id: position_id || null,
    });

  if (error) {
    console.error("Interest creation error:", error);
    return NextResponse.json({ error: "관심 등록에 실패했습니다." }, { status: 500 });
  }

  // 헤드헌터 프로필에서 claimed_by(=users.id)를 찾아 대화방 생성
  const { data: hhData } = await supabase
    .from("headhunters")
    .select("claimed_by")
    .eq("id", headhunter_id)
    .single();

  let conversationId: string | null = null;

  if (hhData?.claimed_by) {
    // 대화방 중복 확인
    let convQuery = supabase
      .from("conversations")
      .select("id")
      .eq("headhunter_id", hhData.claimed_by)
      .eq("participant_id", session.user.id);

    if (position_id) {
      convQuery = convQuery.eq("position_id", position_id);
    } else {
      convQuery = convQuery.is("position_id", null);
    }

    const { data: existingConv } = await convQuery.maybeSingle();

    if (existingConv) {
      conversationId = existingConv.id;
    } else {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({
          headhunter_id: hhData.claimed_by,
          participant_id: session.user.id,
          participant_type: session.user.userType,
          position_id: position_id || null,
          status: "pending",
        })
        .select("id")
        .single();

      conversationId = newConv?.id || null;
    }

    // 헤드헌터에게 알림 전송 (실패해도 무시)
    await supabase
      .from("notifications")
      .insert({
        user_id: hhData.claimed_by,
        type: "interest",
        title: "새로운 관심 표현",
        message: "포지션에 관심을 표현한 사용자가 있습니다.",
        data: JSON.stringify({
          headhunter_id,
          position_id: position_id || null,
          conversation_id: conversationId,
        }),
      });
  }

  return NextResponse.json({ success: true, conversation_id: conversationId });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { headhunter_id, position_id } = body;

  if (!headhunter_id) {
    return NextResponse.json({ error: "헤드헌터 ID가 필요합니다." }, { status: 400 });
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("headhunter_contacts")
    .delete()
    .eq("headhunter_id", headhunter_id)
    .eq("user_id", session.user.id);

  if (position_id) {
    query = query.eq("position_id", position_id);
  } else {
    query = query.is("position_id", null);
  }

  const { error } = await query;

  if (error) {
    console.error("Interest deletion error:", error);
    return NextResponse.json({ error: "관심 취소에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
