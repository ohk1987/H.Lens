import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 게시글 상세 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: post, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (error || !post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  // 조회수 증가
  await supabase
    .from("community_posts")
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq("id", id);

  // 댓글 조회
  const { data: comments } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });

  // 현재 사용자의 좋아요 상태
  let userLiked = false;
  const session = await getServerSession(authOptions);
  if (session?.user) {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (user) {
      const { data: like } = await supabase
        .from("community_likes")
        .select("id")
        .eq("target_type", "post")
        .eq("target_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      userLiked = !!like;
    }
  }

  return NextResponse.json({
    post: { ...post, view_count: (post.view_count || 0) + 1 },
    comments: comments || [],
    userLiked,
  });
}

// 게시글 삭제 (소프트 삭제)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: post } = await supabase
    .from("community_posts")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!post || post.author_id !== user.id) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  await supabase
    .from("community_posts")
    .update({ is_deleted: true })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
