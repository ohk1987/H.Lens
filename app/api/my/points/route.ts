import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all"; // all, earned, spent
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("point_transactions")
    .select("id, points, transaction_type, description, reference_type, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filter === "earned") {
    query = query.gt("points", 0);
  } else if (filter === "spent") {
    query = query.lt("points", 0);
  }

  const { data: transactions, count } = await query
    .range(offset, offset + limit - 1);

  return NextResponse.json({
    transactions: transactions || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
