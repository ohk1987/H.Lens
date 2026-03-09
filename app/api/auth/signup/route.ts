import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isCompanyEmail } from "@/lib/types";
import type { UserType } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    email,
    password,
    nickname,
    userType,
    companyEmail,
    agreedTerms,
  } = body as {
    email: string;
    password: string;
    nickname: string;
    userType: UserType;
    companyEmail?: string;
    agreedTerms?: boolean;
  };

  // 기본 검증
  if (!email || !password || !nickname || !userType) {
    return NextResponse.json(
      { error: "필수 항목을 모두 입력해주세요." },
      { status: 400 }
    );
  }

  // HR 담당자: 회사 이메일 검증
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

  // 헤드헌터: 서치펌 이메일 검증
  if (userType === "headhunter") {
    if (!companyEmail || !isCompanyEmail(companyEmail)) {
      return NextResponse.json(
        { error: "서치펌 이메일(일반 포털 메일 제외)을 입력해주세요." },
        { status: 400 }
      );
    }
  }

  const supabase = createClient();

  // Supabase Auth로 사용자 생성
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
        user_type: userType,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.user) {
    return NextResponse.json(
      { error: "사용자 생성에 실패했습니다." },
      { status: 500 }
    );
  }

  // 프로필 추가 정보 업데이트
  const updateData: Record<string, unknown> = {};

  if (companyEmail) {
    updateData.company_email = companyEmail;
  }

  if (agreedTerms) {
    updateData.agreed_terms_at = new Date().toISOString();
  }

  if (Object.keys(updateData).length > 0) {
    await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", data.user.id);
  }

  return NextResponse.json({
    success: true,
    userId: data.user.id,
    status: userType === "headhunter" ? "pending" : "active",
    message:
      userType === "headhunter"
        ? "회원가입이 완료되었습니다. 관리자 승인 후 활성화됩니다."
        : "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
  });
}
