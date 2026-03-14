import { createAdminClient } from "@/lib/supabase/server";

export type TriggerType =
  | "login"
  | "review_write"
  | "review_verified"
  | "review_liked"
  | "community_post"
  | "community_comment"
  | "community_liked"
  | "position_register"
  | "hh_reply";

// 트리거별 체크할 condition_type 매핑
const TRIGGER_CONDITIONS: Record<TriggerType, string[]> = {
  login: ["login", "login_streak", "total_login"],
  review_write: ["review_count", "quality_review", "first_reviewer", "multi_firm", "verified_review"],
  review_verified: ["verified_review"],
  review_liked: ["review_likes"],
  community_post: ["community_post"],
  community_comment: ["community_comment"],
  community_liked: ["community_likes"],
  position_register: ["hh_position"],
  hh_reply: ["hh_reply"],
};

export async function checkAchievements(userId: string, trigger: TriggerType) {
  const supabase = createAdminClient();

  // 사용자 정보 조회
  const { data: user } = await supabase
    .from("users")
    .select("id, user_type, login_streak, total_login_days, nickname, company_email, status")
    .eq("id", userId)
    .single();

  if (!user) return [];

  const conditionTypes = TRIGGER_CONDITIONS[trigger];
  if (!conditionTypes || conditionTypes.length === 0) return [];

  // 해당 트리거에 관련된 업적 조회 (미달성만)
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .in("condition_type", conditionTypes)
    .in("target_type", ["all", user.user_type || "all"]);

  if (!achievements || achievements.length === 0) return [];

  // 이미 달성한 업적 조회
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const achievedIds = new Set((userAchievements || []).map((ua) => ua.achievement_id));

  // 미달성 업적만 필터
  const uncompleted = achievements.filter((a) => !achievedIds.has(a.id));
  if (uncompleted.length === 0) return [];

  // 각 업적별 현재 값 계산
  const newlyAchieved: { id: string; code: string; name: string; grade: string }[] = [];

  for (const achievement of uncompleted) {
    const currentValue = await getCurrentValue(supabase, userId, user, achievement);

    // 진행도 업데이트
    await supabase
      .from("achievement_progress")
      .upsert(
        {
          user_id: userId,
          achievement_id: achievement.id,
          current_value: currentValue,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,achievement_id" }
      );

    // 달성 여부 확인
    if (currentValue >= achievement.condition_value) {
      const { error } = await supabase
        .from("user_achievements")
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
        });

      if (!error) {
        // 업적 등급별 포인트
        const gradePoints: Record<string, number> = { bronze: 30, silver: 50, gold: 100, platinum: 200 };
        const earnedPoints = gradePoints[achievement.grade] || 50;

        newlyAchieved.push({
          id: achievement.id,
          code: achievement.code,
          name: achievement.name,
          grade: achievement.grade,
        });

        // 알림 생성 (포인트 포함)
        await supabase.from("notifications").insert({
          user_id: userId,
          type: "achievement",
          title: "새 업적 달성!",
          message: `${achievement.name} 업적을 달성했습니다.`,
          data: { achievement_id: achievement.id, code: achievement.code, grade: achievement.grade, points: earnedPoints },
        });

        // 포인트 적립
        try {
          const { awardPoints } = await import("@/lib/points/award");
          await awardPoints(userId, "achievement", achievement.id, "achievement", earnedPoints, `업적 달성: ${achievement.name}`);
        } catch {
          // 포인트 모듈 실패 무시
        }
      }
    }
  }

  return newlyAchieved;
}

async function getCurrentValue(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  user: Record<string, unknown>,
  achievement: { condition_type: string; condition_value: number }
): Promise<number> {
  switch (achievement.condition_type) {
    case "login":
      return 1; // 로그인하면 무조건 달성

    case "login_streak":
      return (user.login_streak as number) || 0;

    case "total_login":
      return (user.total_login_days as number) || 0;

    case "profile": {
      // 프로필 완성도 체크
      const hasNickname = !!(user.nickname);
      const hasType = !!(user.user_type);
      const hasEmail = !!(user.company_email);
      return (hasNickname && hasType && hasEmail) ? 1 : 0;
    }

    case "verified":
      return (user.status === "active" && user.company_email) ? 1 : 0;

    case "review_count": {
      const { count } = await supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("reviewer_id", userId);
      return count || 0;
    }

    case "verified_review": {
      const { count } = await supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("reviewer_id", userId)
        .eq("review_type", "verified");
      return count || 0;
    }

    case "quality_review": {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("content")
        .eq("reviewer_id", userId);
      return (reviews || []).filter((r) => r.content && r.content.length >= 200).length;
    }

    case "review_likes": {
      // 리뷰에 달린 좋아요는 현재 community_likes 기반이 아닌 별도 시스템
      // 간략화: 0 반환 (추후 리뷰 좋아요 구현 시 업데이트)
      return 0;
    }

    case "first_reviewer": {
      // 리뷰 0인 헤드헌터에 첫 리뷰 작성 여부 - 리뷰 작성 시점에서 체크
      const { data: reviews } = await supabase
        .from("reviews")
        .select("headhunter_id")
        .eq("reviewer_id", userId);

      if (!reviews || reviews.length === 0) return 0;

      for (const r of reviews) {
        const { count } = await supabase
          .from("reviews")
          .select("id", { count: "exact", head: true })
          .eq("headhunter_id", r.headhunter_id);
        if (count === 1) return 1; // 이 리뷰가 유일한 리뷰라면 첫 리뷰어
      }
      return 0;
    }

    case "multi_firm": {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("headhunter_id, headhunters(search_firm_id)")
        .eq("reviewer_id", userId);

      const firmIds = new Set<string>();
      for (const r of reviews || []) {
        const hh = r.headhunters as unknown as { search_firm_id: string | null } | null;
        if (hh?.search_firm_id) firmIds.add(hh.search_firm_id);
      }
      return firmIds.size;
    }

    case "multi_industry": {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("industry")
        .eq("reviewer_id", userId);

      const industries = new Set<string>();
      for (const r of reviews || []) {
        if (r.industry) industries.add(r.industry);
      }
      return industries.size;
    }

    case "community_post": {
      const { count } = await supabase
        .from("community_posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", userId)
        .eq("is_deleted", false);
      return count || 0;
    }

    case "community_comment": {
      const { count } = await supabase
        .from("community_comments")
        .select("id", { count: "exact", head: true })
        .eq("author_id", userId)
        .eq("is_deleted", false);
      return count || 0;
    }

    case "community_likes": {
      // 내 게시글들에 달린 좋아요 합계
      const { data: posts } = await supabase
        .from("community_posts")
        .select("like_count")
        .eq("author_id", userId)
        .eq("is_deleted", false);
      return (posts || []).reduce((sum, p) => sum + (p.like_count || 0), 0);
    }

    case "hh_reply": {
      // 헤드헌터가 claim한 프로필의 리뷰 답글 수
      const { data: hunter } = await supabase
        .from("headhunters")
        .select("id")
        .eq("claimed_by", userId)
        .single();

      if (!hunter) return 0;

      const { count } = await supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("headhunter_id", hunter.id)
        .not("headhunter_reply", "is", null);
      return count || 0;
    }

    case "hh_position": {
      const { data: hunter } = await supabase
        .from("headhunters")
        .select("id")
        .eq("claimed_by", userId)
        .single();

      if (!hunter) return 0;

      const { count } = await supabase
        .from("headhunter_positions")
        .select("id", { count: "exact", head: true })
        .eq("headhunter_id", hunter.id);
      return count || 0;
    }

    case "hh_rating": {
      const { data: hunter } = await supabase
        .from("headhunters")
        .select("id")
        .eq("claimed_by", userId)
        .single();

      if (!hunter) return 0;

      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating_overall")
        .eq("headhunter_id", hunter.id);

      if (!reviews || reviews.length < 5) return 0;
      const avg = reviews.reduce((s, r) => s + r.rating_overall, 0) / reviews.length;
      return Math.round(avg * 10); // 4.0 → 40
    }

    case "hh_rating_high": {
      const { data: hunter } = await supabase
        .from("headhunters")
        .select("id")
        .eq("claimed_by", userId)
        .single();

      if (!hunter) return 0;

      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating_overall")
        .eq("headhunter_id", hunter.id);

      if (!reviews || reviews.length < 10) return 0;
      const avg = reviews.reduce((s, r) => s + r.rating_overall, 0) / reviews.length;
      return Math.round(avg * 10);
    }

    case "hh_top": {
      // 상위 % 확인 - 간략화
      return 0;
    }

    case "hh_top_sustained":
      return 0;

    case "invite":
      return 0;

    default:
      return 0;
  }
}

// 로그인 시 streak 업데이트
export async function updateLoginStreak(userId: string) {
  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("users")
    .select("last_login_at, login_streak, total_login_days")
    .eq("id", userId)
    .single();

  if (!user) return;

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const lastLogin = user.last_login_at ? new Date(user.last_login_at) : null;
  const lastLoginDate = lastLogin ? lastLogin.toISOString().split("T")[0] : null;

  // 같은 날 재로그인이면 무시
  if (lastLoginDate === today) return;

  let newStreak = user.login_streak || 0;
  const newTotal = (user.total_login_days || 0) + 1;

  if (lastLoginDate) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastLoginDate === yesterdayStr) {
      newStreak += 1; // 연속 로그인
    } else {
      newStreak = 1; // 연속 끊김
    }
  } else {
    newStreak = 1; // 첫 로그인
  }

  await supabase
    .from("users")
    .update({
      last_login_at: now.toISOString(),
      login_streak: newStreak,
      total_login_days: newTotal,
    })
    .eq("id", userId);

  // 로그인 업적 체크
  await checkAchievements(userId, "login");

  // 로그인 연속 스트릭 포인트
  try {
    const { awardPoints } = await import("@/lib/points/award");
    if (newStreak === 7) {
      await awardPoints(userId, "login_streak_7", null, null, undefined, "7일 연속 로그인 보너스");
    }
    if (newStreak === 30) {
      await awardPoints(userId, "login_streak_30", null, null, undefined, "30일 연속 로그인 보너스");
    }
  } catch {
    // 포인트 모듈 실패 무시
  }
}
