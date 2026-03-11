import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";
import { COMMUNITY_CATEGORIES, COMMUNITY_ACCESS } from "@/lib/community-constants";
import type { CommunityType } from "@/lib/community-constants";

export const dynamic = "force-dynamic";

// 게시글 목록 조회
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as CommunityType | null;
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  if (!type || !COMMUNITY_CATEGORIES[type]) {
    return NextResponse.json({ error: "Invalid community type" }, { status: 400 });
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("community_posts")
    .select("*", { count: "exact" })
    .eq("community_type", type)
    .eq("is_deleted", false)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const { data: posts, count, error } = await query;

  if (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }

  return NextResponse.json({
    posts: posts || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

// 게시글 작성
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { community_type, category, title, content } = body;

  if (!community_type || !category || !title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }

  // 권한 확인
  if (COMMUNITY_ACCESS[community_type as CommunityType] !== session.user.userType) {
    return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
  }

  const supabase = createAdminClient();

  // 사용자 정보 조회
  const { data: user } = await supabase
    .from("users")
    .select("id, nickname, status")
    .eq("email", session.user.email)
    .single();

  if (!user || user.status !== "active") {
    return NextResponse.json({ error: "활성 계정만 글을 작성할 수 있습니다." }, { status: 403 });
  }

  if (!user.nickname) {
    return NextResponse.json({ error: "닉네임을 먼저 설정해주세요." }, { status: 400 });
  }

  if (title.trim().length > 100) {
    return NextResponse.json({ error: "제목은 100자 이내로 작성해주세요." }, { status: 400 });
  }

  if (content.trim().length > 5000) {
    return NextResponse.json({ error: "본문은 5000자 이내로 작성해주세요." }, { status: 400 });
  }

  const { data: post, error } = await supabase
    .from("community_posts")
    .insert({
      community_type,
      category,
      title: title.trim(),
      content: content.trim(),
      author_id: user.id,
      nickname: user.nickname,
      job_function: body.job_function || null,
      career_level: body.career_level || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Post create error:", error);
    return NextResponse.json({ error: "작성 실패" }, { status: 500 });
  }

  return NextResponse.json({ post });
}
