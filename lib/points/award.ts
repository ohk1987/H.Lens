import { createAdminClient } from "@/lib/supabase/server";

/** 포인트 적립 규칙 */
const POINT_VALUES: Record<string, { points: number; description: string }> = {
  review_write: { points: 100, description: "리뷰 작성" },
  review_verified: { points: 200, description: "인증 리뷰 추가 보너스" },
  review_liked: { points: 10, description: "리뷰 좋아요 받기" },
  review_deleted: { points: -100, description: "리뷰 삭제 차감" },
  community_post: { points: 50, description: "커뮤니티 글 작성" },
  community_comment: { points: 10, description: "댓글 작성" },
  community_liked: { points: 5, description: "좋아요 받기" },
  login_streak_7: { points: 50, description: "7일 연속 로그인 보너스" },
  login_streak_30: { points: 200, description: "30일 연속 로그인 보너스" },
  achievement: { points: 50, description: "업적 달성" },
  invite: { points: 500, description: "친구 초대" },
  position_register: { points: 100, description: "포지션 등록" },
  review_reply: { points: 50, description: "리뷰 답글 작성" },
  response_rate_90: { points: 200, description: "응답률 90% 유지 보너스" },
};

/** 일일 적립 한도 */
const DAILY_LIMITS: Record<string, number> = {
  community_comment: 50,
  community_liked: 100,
  review_liked: 50,
};

interface AwardResult {
  success: boolean;
  points: number;
  message?: string;
}

/**
 * 포인트 적립/차감 함수
 * @param userId 사용자 ID
 * @param transactionType 적립 유형
 * @param referenceId 참조 ID (리뷰ID, 게시글ID 등)
 * @param referenceType 참조 타입 ('review', 'community_post' 등)
 * @param customPoints 커스텀 포인트 (기본 규칙 대신 사용)
 * @param customDescription 커스텀 설명
 */
export async function awardPoints(
  userId: string,
  transactionType: string,
  referenceId?: string | null,
  referenceType?: string | null,
  customPoints?: number,
  customDescription?: string,
): Promise<AwardResult> {
  const supabase = createAdminClient();

  const rule = POINT_VALUES[transactionType];
  const points = customPoints ?? rule?.points;
  const description = customDescription ?? rule?.description ?? transactionType;

  if (points === undefined || points === 0) {
    return { success: false, points: 0, message: "알 수 없는 적립 유형" };
  }

  // 중복 적립 방지: 같은 reference_id + transaction_type 조합
  if (referenceId) {
    const { data: existing } = await supabase
      .from("point_transactions")
      .select("id")
      .eq("user_id", userId)
      .eq("transaction_type", transactionType)
      .eq("reference_id", referenceId)
      .limit(1)
      .single();

    if (existing) {
      return { success: false, points: 0, message: "이미 적립된 항목" };
    }
  }

  // 일일 적립 한도 체크
  const dailyLimit = DAILY_LIMITS[transactionType];
  if (dailyLimit && points > 0) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: todayTransactions } = await supabase
      .from("point_transactions")
      .select("points")
      .eq("user_id", userId)
      .eq("transaction_type", transactionType)
      .gte("created_at", todayStart.toISOString());

    const todayTotal = (todayTransactions || []).reduce(
      (sum, t) => sum + (t.points > 0 ? t.points : 0),
      0
    );

    if (todayTotal >= dailyLimit) {
      return { success: false, points: 0, message: "일일 한도 초과" };
    }

    // 한도를 넘지 않도록 조정
    const remaining = dailyLimit - todayTotal;
    if (points > remaining) {
      return { success: false, points: 0, message: "일일 한도 초과" };
    }
  }

  // 포인트 트랜잭션 삽입
  const { error: insertError } = await supabase
    .from("point_transactions")
    .insert({
      user_id: userId,
      points,
      transaction_type: transactionType,
      description,
      reference_id: referenceId || null,
      reference_type: referenceType || null,
    });

  if (insertError) {
    console.error("Point transaction insert error:", insertError);
    return { success: false, points: 0, message: "포인트 적립 실패" };
  }

  // total_points 업데이트
  const { data: userData } = await supabase
    .from("users")
    .select("total_points")
    .eq("id", userId)
    .single();

  const currentPoints = userData?.total_points || 0;
  const newTotal = currentPoints + points;

  await supabase
    .from("users")
    .update({ total_points: newTotal })
    .eq("id", userId);

  return { success: true, points };
}

export { POINT_VALUES };
