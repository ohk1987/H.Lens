import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: review, error } = await supabase
    .from("reviews")
    .select(`
      *,
      headhunters (
        id, name, email, phone, search_firm_id,
        search_firms ( id, name )
      )
    `)
    .eq("id", params.id)
    .eq("reviewer_id", session.user.id)
    .single();

  if (error || !review) {
    return NextResponse.json({ error: "리뷰를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ review });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = createAdminClient();

  // 본인 리뷰인지 확인
  const { data: existing } = await supabase
    .from("reviews")
    .select("id, reviewer_id")
    .eq("id", params.id)
    .single();

  if (!existing || existing.reviewer_id !== session.user.id) {
    return NextResponse.json({ error: "수정 권한이 없습니다." }, { status: 403 });
  }

  const body = await request.json();

  const updateData = {
    contact_date: body.contactDate,
    contact_channel: body.contactChannel,
    company_name: body.companyName || null,
    company_size: body.companySize || null,
    industry: body.industry,
    job_function: body.jobFunction,
    career_level: body.seniority,
    result: body.progressResult,
    rating_professionalism: body.ratings.professionalism,
    rating_communication: body.ratings.communication,
    rating_reliability: body.ratings.reliability,
    rating_support: body.ratings.support,
    rating_transparency: body.ratings.transparency,
    rating_overall: body.overallRating,
    keywords_positive: body.keywordsPositive || [],
    keywords_negative: body.keywordsNegative || [],
    content: body.content,
    recommend: body.wouldRecommend,
    hr_rating_fee: body.hrExtraRatings?.feeAdequacy || null,
    hr_rating_guarantee: body.hrExtraRatings?.guaranteeSatisfaction || null,
    hr_rating_contract: body.hrExtraRatings?.contractTerms || null,
  };

  const { error } = await supabase
    .from("reviews")
    .update(updateData)
    .eq("id", params.id);

  if (error) {
    console.error("Review update error:", error);
    return NextResponse.json({ error: "리뷰 수정에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = createAdminClient();

  // 본인 리뷰인지 확인
  const { data: existing } = await supabase
    .from("reviews")
    .select("id, reviewer_id")
    .eq("id", params.id)
    .single();

  if (!existing || existing.reviewer_id !== session.user.id) {
    return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", params.id);

  if (error) {
    console.error("Review delete error:", error);
    return NextResponse.json({ error: "리뷰 삭제에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
