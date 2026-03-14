import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ count: 0 });
  }

  const supabase = createAdminClient();
  const userId = session.user.id;

  // 내가 참여한 대화방의 읽지 않은 메시지 수
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .or(`headhunter_id.eq.${userId},participant_id.eq.${userId}`);

  if (!conversations || conversations.length === 0) {
    return NextResponse.json({ count: 0 });
  }

  const convIds = conversations.map((c) => c.id);

  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .in("conversation_id", convIds)
    .neq("sender_id", userId)
    .eq("is_read", false);

  return NextResponse.json({ count: count || 0 });
}
