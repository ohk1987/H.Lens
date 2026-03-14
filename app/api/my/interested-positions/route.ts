import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  // 내가 참여한 대화 조회 (관심 표현한 포지션)
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, position_id, headhunter_id, status, created_at, updated_at")
    .eq("participant_id", user.id)
    .order("updated_at", { ascending: false });

  if (!conversations || conversations.length === 0) {
    return NextResponse.json({ positions: [] });
  }

  // 포지션 정보 조회
  const positionIds = conversations
    .map((c) => c.position_id)
    .filter((id): id is string => id !== null);

  let positionMap = new Map<string, { title: string; industry: string; company_size: string; company_description: string | null }>();
  if (positionIds.length > 0) {
    const { data: positions } = await supabase
      .from("headhunter_positions")
      .select("id, title, industry, company_size, company_description")
      .in("id", positionIds);

    positionMap = new Map(
      (positions || []).map((p) => [p.id, p])
    );
  }

  // 헤드헌터 user ID → 헤드헌터 프로필 조회
  const headhunterUserIds = Array.from(new Set(conversations.map((c) => c.headhunter_id)));
  const { data: headhunters } = await supabase
    .from("headhunters")
    .select("id, name, claimed_by, search_firms(name)")
    .in("claimed_by", headhunterUserIds);

  const hhMap = new Map(
    (headhunters || []).map((h) => [h.claimed_by, h])
  );

  const result = conversations.map((conv) => {
    const position = conv.position_id ? positionMap.get(conv.position_id) : null;
    const hh = hhMap.get(conv.headhunter_id);
    const firm = hh?.search_firms as unknown as { name: string } | null;

    return {
      conversation_id: conv.id,
      position_id: conv.position_id,
      status: conv.status,
      interest_date: conv.created_at,
      updated_at: conv.updated_at,
      position_title: position?.title || null,
      industry: position?.industry || null,
      company_size: position?.company_size || null,
      company_description: position?.company_description || null,
      headhunter_name: hh?.name || "알 수 없음",
      firm_name: firm?.name || "",
    };
  });

  return NextResponse.json({ positions: result });
}
