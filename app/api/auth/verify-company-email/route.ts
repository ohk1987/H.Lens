import { NextRequest, NextResponse } from "next/server";
import { isCompanyEmail } from "@/lib/types";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ valid: false, error: "이메일을 입력해주세요." });
  }

  const valid = isCompanyEmail(email);

  if (!valid) {
    return NextResponse.json({
      valid: false,
      error: "일반 포털 이메일(gmail, naver 등)은 사용할 수 없습니다. 회사/서치펌 이메일을 입력해주세요.",
    });
  }

  return NextResponse.json({ valid: true });
}
