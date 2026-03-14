import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";
import { awardPoints } from "@/lib/points/award";

export const dynamic = "force-dynamic";

async function getHeadhunterForUser(supabase: ReturnType<typeof createAdminClient>, email: string) {
  const { data: user } = await supabase.from("users").select("id, status").eq("email", email).single();
  if (!user || user.status !== "active") return null;

  const { data: hunter } = await supabase.from("headhunters").select("id").eq("claimed_by", user.id).single();
  return hunter;
}

// 포지션 추가
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "headhunter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const hunter = await getHeadhunterForUser(supabase, session.user.email);
  if (!hunter) return NextResponse.json({ error: "No profile" }, { status: 404 });

  // 현재 포지션 수 확인 (최대 5개)
  const { count } = await supabase
    .from("headhunter_positions")
    .select("id", { count: "exact", head: true })
    .eq("headhunter_id", hunter.id);

  if ((count || 0) >= 5) {
    return NextResponse.json({ error: "포지션은 최대 5개까지 등록 가능합니다." }, { status: 400 });
  }

  const body = await request.json();
  const { title, industry, company_size, career_min, career_max, description, actual_company_name, company_description } = body;

  if (!title || !industry || !company_size) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("headhunter_positions")
    .insert({
      headhunter_id: hunter.id,
      title,
      industry,
      company_size,
      career_min: career_min || 0,
      career_max: career_max || 0,
      description: description || null,
      actual_company_name: actual_company_name || null,
      company_description: company_description || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Position insert error:", error);
    return NextResponse.json({ error: "등록 실패" }, { status: 500 });
  }

  // 포인트 적립
  const { data: posUser } = await supabase.from("users").select("id").eq("email", session.user.email).single();
  if (posUser) {
    awardPoints(posUser.id, "position_register", data.id, "position").catch(() => {});
  }

  return NextResponse.json({ position: data });
}

// 포지션 수정 (활성/비활성 토글 포함)
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "headhunter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const hunter = await getHeadhunterForUser(supabase, session.user.email);
  if (!hunter) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: "포지션 ID가 필요합니다." }, { status: 400 });

  // 본인 포지션인지 확인
  const { data: pos } = await supabase
    .from("headhunter_positions")
    .select("headhunter_id")
    .eq("id", id)
    .single();

  if (!pos || pos.headhunter_id !== hunter.id) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  const allowedFields: Record<string, unknown> = {};
  if ("is_active" in updates) allowedFields.is_active = updates.is_active;
  if ("title" in updates) allowedFields.title = updates.title;
  if ("industry" in updates) allowedFields.industry = updates.industry;
  if ("company_size" in updates) allowedFields.company_size = updates.company_size;
  if ("career_min" in updates) allowedFields.career_min = updates.career_min;
  if ("career_max" in updates) allowedFields.career_max = updates.career_max;
  if ("description" in updates) allowedFields.description = updates.description;
  if ("actual_company_name" in updates) allowedFields.actual_company_name = updates.actual_company_name;
  if ("company_description" in updates) allowedFields.company_description = updates.company_description;

  const { error } = await supabase
    .from("headhunter_positions")
    .update(allowedFields)
    .eq("id", id);

  if (error) {
    console.error("Position update error:", error);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// 포지션 삭제
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "headhunter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const hunter = await getHeadhunterForUser(supabase, session.user.email);
  if (!hunter) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "포지션 ID가 필요합니다." }, { status: 400 });

  const { data: pos } = await supabase
    .from("headhunter_positions")
    .select("headhunter_id")
    .eq("id", id)
    .single();

  if (!pos || pos.headhunter_id !== hunter.id) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  const { error } = await supabase.from("headhunter_positions").delete().eq("id", id);

  if (error) {
    console.error("Position delete error:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
