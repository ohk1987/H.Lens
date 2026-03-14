import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";
import { awardPoints } from "@/lib/points/award";

export const dynamic = "force-dynamic";

// 댓글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { content } = await request.json();

  if (!content?.trim() || content.trim().length > 1000) {
    return NextResponse.json({ error: "댓글은 1~1000자 사이로 작성해주세요." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("users")
    .select("id, nickname, status")
    .eq("email", session.user.email)
    .single();

  if (!user || user.status !== "active" || !user.nickname) {
    return NextResponse.json({ error: "댓글을 작성할 수 없습니다." }, { status: 403 });
  }

  // 게시글 존재 확인
  const { data: post } = await supabase
    .from("community_posts")
    .select("id, community_type")
    .eq("id", postId)
    .eq("is_deleted", false)
    .single();

  if (!post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  // 커뮤니티 접근 권한 확인
  if (post.community_type !== session.user.userType) {
    return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
  }

  const { data: comment, error } = await supabase
    .from("community_comments")
    .insert({
      post_id: postId,
      author_id: user.id,
      nickname: user.nickname,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Comment create error:", error);
    return NextResponse.json({ error: "댓글 작성 실패" }, { status: 500 });
  }

  // 포인트 적립
  awardPoints(user.id, "community_comment", comment.id, "community_comment").catch(() => {});

  // 댓글 수 증가
  await supabase
    .from("community_posts")
    .update({ comment_count: (await supabase.from("community_comments").select("id", { count: "exact", head: true }).eq("post_id", postId).eq("is_deleted", false)).count || 0 })
    .eq("id", postId);

  return NextResponse.json({ comment });
}
