import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 이름으로 헤드헌터 검색 (리뷰 작성 시 사용)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name || name.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("headhunters")
    .select(`
      id,
      name,
      is_claimed,
      verification_level,
      search_firm_id,
      search_firms (
        name
      )
    `)
    .ilike("name", `%${name}%`)
    .limit(10);

  if (error) {
    console.error("Headhunter search error:", error);
    return NextResponse.json({ results: [] });
  }

  const results = (data || []).map((h) => {
    const firm = h.search_firms as unknown as { name: string } | null;
    return {
      id: h.id,
      name: h.name,
      firm_name: firm?.name || "소속 없음",
      is_claimed: h.is_claimed,
      verification_level: h.verification_level || "none",
    };
  });

  return NextResponse.json({ results });
}
