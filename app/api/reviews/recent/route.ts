import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      id,
      headhunter_id,
      review_type,
      rating_overall,
      rating_professionalism,
      rating_communication,
      rating_reliability,
      rating_support,
      rating_transparency,
      keywords_positive,
      content,
      industry,
      job_function,
      created_at,
      headhunters (
        name,
        search_firm_id,
        search_firms (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Recent reviews error:", error);
    return NextResponse.json({ reviews: [] });
  }

  const result = (reviews || []).map((r) => {
    const hunter = r.headhunters as unknown as {
      name: string;
      search_firm_id: string | null;
      search_firms: { name: string } | null;
    } | null;

    return {
      id: r.id,
      headhunter_id: r.headhunter_id,
      headhunter_name: hunter?.name || "알 수 없음",
      headhunter_firm: hunter?.search_firms?.name || "",
      review_type: r.review_type,
      rating_overall: r.rating_overall,
      ratings: {
        professionalism: r.rating_professionalism,
        communication: r.rating_communication,
        reliability: r.rating_reliability,
        support: r.rating_support,
        transparency: r.rating_transparency,
      },
      keywords_positive: r.keywords_positive || [],
      content: r.content,
      job_field: `${r.industry || ""} / ${r.job_function || ""}`.replace(/^\s*\/\s*$/, ""),
      created_at: r.created_at,
    };
  });

  return NextResponse.json({ reviews: result });
}
