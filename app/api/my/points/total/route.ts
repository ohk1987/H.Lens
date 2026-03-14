import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ total_points: 0 });
  }

  const supabase = createAdminClient();
  const { data: user } = await supabase
    .from("users")
    .select("total_points")
    .eq("email", session.user.email)
    .single();

  return NextResponse.json({ total_points: user?.total_points || 0 });
}
