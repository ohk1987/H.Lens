import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 내 업적 목록 + 전체 업적 + 진행도
export async function GET() {
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

  // 전체 업적 (해당 사용자 타입에 맞는 것만)
  const { data: allAchievements } = await supabase
    .from("achievements")
    .select("*")
    .in("target_type", ["all", session.user.userType || "all"])
    .order("grade");

  // 달성한 업적
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", user.id);

  // 진행도
  const { data: progress } = await supabase
    .from("achievement_progress")
    .select("*")
    .eq("user_id", user.id);

  const achievedMap = new Map((userAchievements || []).map((ua) => [ua.achievement_id, ua]));
  const progressMap = new Map((progress || []).map((p) => [p.achievement_id, p]));

  const result = (allAchievements || []).map((a) => ({
    ...a,
    achieved: achievedMap.has(a.id),
    achieved_at: achievedMap.get(a.id)?.achieved_at || null,
    is_displayed: achievedMap.get(a.id)?.is_displayed || false,
    current_value: progressMap.get(a.id)?.current_value || 0,
  }));

  return NextResponse.json({ achievements: result });
}

// 표시 배지 토글
export async function PATCH(request: NextRequest) {
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

  const { achievementId, isDisplayed } = await request.json();

  if (!achievementId) {
    return NextResponse.json({ error: "achievementId 필요" }, { status: 400 });
  }

  // 최대 3개 표시 제한
  if (isDisplayed) {
    const { count } = await supabase
      .from("user_achievements")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_displayed", true);

    if ((count || 0) >= 3) {
      return NextResponse.json({ error: "최대 3개까지 표시 가능합니다." }, { status: 400 });
    }
  }

  await supabase
    .from("user_achievements")
    .update({ is_displayed: isDisplayed })
    .eq("user_id", user.id)
    .eq("achievement_id", achievementId);

  return NextResponse.json({ success: true });
}
