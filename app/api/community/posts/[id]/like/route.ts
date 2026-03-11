import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 좋아요 토글
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
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

  // 기존 좋아요 확인
  const { data: existing } = await supabase
    .from("community_likes")
    .select("id")
    .eq("target_type", "post")
    .eq("target_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // 좋아요 취소
    await supabase.from("community_likes").delete().eq("id", existing.id);

    // 카운트 감소
    const { count } = await supabase
      .from("community_likes")
      .select("id", { count: "exact", head: true })
      .eq("target_type", "post")
      .eq("target_id", postId);

    await supabase
      .from("community_posts")
      .update({ like_count: count || 0 })
      .eq("id", postId);

    return NextResponse.json({ liked: false, like_count: count || 0 });
  } else {
    // 좋아요 추가
    await supabase
      .from("community_likes")
      .insert({ target_type: "post", target_id: postId, user_id: user.id });

    const { count } = await supabase
      .from("community_likes")
      .select("id", { count: "exact", head: true })
      .eq("target_type", "post")
      .eq("target_id", postId);

    await supabase
      .from("community_posts")
      .update({ like_count: count || 0 })
      .eq("id", postId);

    return NextResponse.json({ liked: true, like_count: count || 0 });
  }
}
