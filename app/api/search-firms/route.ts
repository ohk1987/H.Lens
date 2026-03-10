import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("search_firms")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("Search firms error:", error);
    return NextResponse.json({ firms: [] });
  }

  return NextResponse.json({ firms: data || [] });
}
