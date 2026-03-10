import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    return NextResponse.json({ articles: [] });
  }

  // DB 컬럼명을 프론트엔드 인터페이스에 맞게 매핑
  const mapped = (articles || []).map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    summary: a.summary,
    target_type: a.target_type,
    category: a.category,
    author: a.author,
    thumbnail_url: a.thumbnail_url,
    published_at: a.published_at,
    created_at: a.created_at,
  }));

  return NextResponse.json({ articles: mapped });
}
