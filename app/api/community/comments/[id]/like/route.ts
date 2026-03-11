import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: commentId } = await params;
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

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: existing } = await supabase
    .from("community_likes")
    .select("id")
    .eq("target_type", "comment")
    .eq("target_id", commentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("community_likes").delete().eq("id", existing.id);
    const { count } = await supabase
      .from("community_likes")
      .select("id", { count: "exact", head: true })
      .eq("target_type", "comment")
      .eq("target_id", commentId);

    await supabase.from("community_comments").update({ like_count: count || 0 }).eq("id", commentId);
    return NextResponse.json({ liked: false, like_count: count || 0 });
  } else {
    await supabase.from("community_likes").insert({ target_type: "comment", target_id: commentId, user_id: user.id });
    const { count } = await supabase
      .from("community_likes")
      .select("id", { count: "exact", head: true })
      .eq("target_type", "comment")
      .eq("target_id", commentId);

    await supabase.from("community_comments").update({ like_count: count || 0 }).eq("id", commentId);
    return NextResponse.json({ liked: true, like_count: count || 0 });
  }
}
