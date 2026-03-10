import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  const [reviewsRes, huntersRes] = await Promise.all([
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("headhunters").select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    reviewCount: reviewsRes.count || 0,
    headhunterCount: huntersRes.count || 0,
  });
}
