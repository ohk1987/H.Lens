import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";
import { checkAchievements } from "@/lib/achievements/checker";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  if (session.user.userType === "headhunter") {
    return NextResponse.json({ error: "헤드헌터는 리뷰를 작성할 수 없습니다." }, { status: 403 });
  }

  const body = await request.json();
  const supabase = createAdminClient();

  // 1. 헤드헌터 찾기 또는 신규 생성
  let headhunterId = body.headhunterId;

  if (!headhunterId) {
    // 이메일/전화로 기존 헤드헌터 검색
    let existingHh = null;

    if (body.headhunterEmail) {
      const { data } = await supabase
        .from("headhunters")
        .select("id")
        .eq("email", body.headhunterEmail)
        .single();
      existingHh = data;
    }

    if (!existingHh && body.headhunterPhone) {
      const phone = body.headhunterPhone.replace(/[^0-9]/g, "");
      const { data } = await supabase
        .from("headhunters")
        .select("id")
        .eq("phone", phone)
        .single();
      existingHh = data;
    }

    if (existingHh) {
      headhunterId = existingHh.id;
    } else {
      // 신규 헤드헌터 생성
      const insertData: Record<string, unknown> = {
        name: body.headhunterName,
      };
      if (body.headhunterEmail) insertData.email = body.headhunterEmail;
      if (body.headhunterPhone) insertData.phone = body.headhunterPhone.replace(/[^0-9]/g, "");

      // 서치펌 연결
      if (body.searchFirmId && body.searchFirmId !== "custom") {
        insertData.search_firm_id = body.searchFirmId;
      }

      const { data: newHh, error: hhError } = await supabase
        .from("headhunters")
        .insert(insertData)
        .select("id")
        .single();

      if (hhError) {
        console.error("Headhunter creation error:", hhError);
        return NextResponse.json({ error: "헤드헌터 등록에 실패했습니다." }, { status: 500 });
      }

      headhunterId = newHh.id;
    }
  }

  // 2. 리뷰 저장
  const reviewData = {
    headhunter_id: headhunterId,
    reviewer_id: session.user.id,
    reviewer_type: session.user.userType,
    review_type: body.evidenceFileUrl ? "verified" : "general",
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
    evidence_file_url: body.evidenceFileUrl || null,
    // HR 전용 평점
    hr_rating_fee: body.hrExtraRatings?.feeAdequacy || null,
    hr_rating_guarantee: body.hrExtraRatings?.guaranteeSatisfaction || null,
    hr_rating_contract: body.hrExtraRatings?.contractTerms || null,
  };

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .insert(reviewData)
    .select("id")
    .single();

  if (reviewError) {
    console.error("Review creation error:", reviewError);
    return NextResponse.json({ error: "리뷰 저장에 실패했습니다: " + reviewError.message }, { status: 500 });
  }

  // 업적 체크 (비동기, 실패해도 리뷰 응답에 영향 없음)
  checkAchievements(session.user.id, "review_write").catch(() => {});
  if (body.evidenceFileUrl) {
    checkAchievements(session.user.id, "review_verified").catch(() => {});
  }

  return NextResponse.json({ success: true, reviewId: review.id });
}
