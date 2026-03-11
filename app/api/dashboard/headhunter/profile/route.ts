import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 프로필 수정
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "headhunter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("users")
    .select("id, status")
    .eq("email", session.user.email)
    .single();

  if (!user || user.status !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: hunter } = await supabase
    .from("headhunters")
    .select("id, search_firm_id")
    .eq("claimed_by", user.id)
    .single();

  if (!hunter) {
    return NextResponse.json({ error: "No profile" }, { status: 404 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  // bio 업데이트
  if ("bio" in body) {
    const bio = (body.bio || "").trim();
    if (bio.length > 100) {
      return NextResponse.json({ error: "한 줄 소개는 최대 100자입니다." }, { status: 400 });
    }
    updates.bio = bio || null;
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from("headhunters")
      .update(updates)
      .eq("id", hunter.id);

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: "프로필 수정 실패" }, { status: 500 });
    }
  }

  // specialty_fields 업데이트 (서치펌 테이블)
  if ("specialty_fields" in body && hunter.search_firm_id) {
    const fields = body.specialty_fields;
    if (Array.isArray(fields)) {
      const { error } = await supabase
        .from("search_firms")
        .update({ specialty_fields: fields })
        .eq("id", hunter.search_firm_id);

      if (error) {
        console.error("Specialty fields update error:", error);
      }
    }
  }

  return NextResponse.json({ success: true });
}
