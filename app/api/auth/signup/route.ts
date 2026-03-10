import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isCompanyEmail } from "@/lib/types";
import type { UserType } from "@/lib/types";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    email,
    password,
    name,
    userType,
    companyEmail,
    agreedTerms,
  } = body as {
    email: string;
    password: string;
    name: string;
    userType: UserType;
    companyEmail?: string;
    agreedTerms?: boolean;
  };

  if (!email || !password || !name || !userType) {
    return NextResponse.json(
      { error: "필수 항목을 모두 입력해주세요." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "비밀번호는 6자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  // HR 담당자: 회사 이메일 + 약관 동의 필수
  if (userType === "hr_manager") {
    if (!companyEmail || !isCompanyEmail(companyEmail)) {
      return NextResponse.json(
        { error: "회사 이메일(일반 포털 메일 제외)을 입력해주세요." },
        { status: 400 }
      );
    }
    if (!agreedTerms) {
      return NextResponse.json(
        { error: "허위 작성 시 법적 책임 동의가 필요합니다." },
        { status: 400 }
      );
    }
  }

  // 헤드헌터: 서치펌 이메일 필수
  if (userType === "headhunter") {
    if (!companyEmail || !isCompanyEmail(companyEmail)) {
      return NextResponse.json(
        { error: "서치펌 이메일(일반 포털 메일 제외)을 입력해주세요." },
        { status: 400 }
      );
    }
  }

  const supabase = createClient();

  // 중복 이메일 확인
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "이미 가입된 이메일입니다." },
      { status: 409 }
    );
  }

  // 비밀번호 해시
  const passwordHash = await bcrypt.hash(password, 12);

  // users 테이블에 레코드 생성
  const status = userType === "headhunter" ? "pending" : "active";

  const insertData: Record<string, unknown> = {
    email,
    name,
    password_hash: passwordHash,
    user_type: userType,
    status,
  };

  if (companyEmail) insertData.company_email = companyEmail;
  if (agreedTerms) insertData.agreed_terms_at = new Date().toISOString();

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert(insertData)
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    userId: newUser?.id,
    status,
    message:
      userType === "headhunter"
        ? "회원가입이 완료되었습니다. 관리자 승인 후 활성화됩니다."
        : "회원가입이 완료되었습니다.",
  });
}
