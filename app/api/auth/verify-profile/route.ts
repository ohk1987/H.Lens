import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { companyEmail, agreedTerms } = await request.json();

  const supabase = createAdminClient();

  const updateData: Record<string, unknown> = {};

  if (companyEmail) {
    updateData.company_email = companyEmail;
  }

  if (agreedTerms) {
    updateData.agreed_terms_at = new Date().toISOString();
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "업데이트할 정보가 없습니다." }, { status: 400 });
  }

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("email", session.user.email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
