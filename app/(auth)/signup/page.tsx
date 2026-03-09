"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { UserType } from "@/lib/types";

const USER_TYPE_INFO = {
  job_seeker: {
    label: "구직자",
    desc: "헤드헌터 리뷰를 조회하고 작성할 수 있습니다.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    requiresCompanyEmail: false,
    requiresDoc: false,
    requiresTerms: false,
  },
  hr_manager: {
    label: "HR 담당자",
    desc: "헤드헌터 리뷰를 조회하고, 채용 관점에서 리뷰를 작성할 수 있습니다.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    requiresCompanyEmail: true,
    requiresDoc: true,
    requiresTerms: true,
  },
  headhunter: {
    label: "헤드헌터",
    desc: "본인 프로필을 관리하고, 리뷰에 답변할 수 있습니다. 관리자 승인이 필요합니다.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    requiresCompanyEmail: true,
    requiresDoc: true,
    requiresTerms: false,
  },
};

export default function SignupPage() {
  const [step, setStep] = useState(0); // 0: 유형 선택, 1: 기본 정보, 2: 추가 인증
  const [userType, setUserType] = useState<UserType>("job_seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyEmailError, setCompanyEmailError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const info = USER_TYPE_INFO[userType];

  const validateCompanyEmail = async (email: string) => {
    if (!email) return;
    const res = await fetch("/api/auth/verify-company-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setCompanyEmailError(data.valid ? "" : data.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    try {
      // 1. 회원가입 API 호출
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nickname,
          userType,
          companyEmail: companyEmail || undefined,
          agreedTerms,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // 2. 파일 업로드 (필요한 경우)
      if (file && data.userId) {
        // 로그인 후 업로드해야 하므로, 먼저 로그인
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginResult?.ok) {
          const formData = new FormData();
          formData.append("file", file);
          await fetch("/api/upload/verification-doc", {
            method: "POST",
            body: formData,
          });
        }
      }

      // 3. 리다이렉트
      if (data.status === "pending") {
        router.push("/login?message=pending");
      } else {
        router.push("/login?message=check-email");
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">회원가입</h1>
          <p className="text-[var(--muted)] mt-2">H.Lens 계정을 만들어보세요</p>
        </div>

        {/* 소셜 로그인 (구직자만) */}
        {step === 0 && (
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("kakao", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#191919] py-3 rounded-xl font-medium hover:bg-[#FDD800] transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.727 1.81 5.122 4.54 6.467-.2.747-.724 2.707-.83 3.126-.13.52.192.512.403.373.166-.11 2.638-1.793 3.71-2.519.7.104 1.424.159 2.177.159 5.523 0 10-3.463 10-7.606C22 6.463 17.523 3 12 3z" />
              </svg>
              카카오로 빠른 가입
            </button>
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] py-3 rounded-xl font-medium hover:bg-[var(--muted-bg)] transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 빠른 가입
            </button>
          </div>
        )}

        {step === 0 && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[var(--card-border)]" />
              <span className="text-sm text-[var(--muted)]">이메일로 가입</span>
              <div className="flex-1 h-px bg-[var(--card-border)]" />
            </div>

            {/* Step 0: 유형 선택 */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-[var(--foreground)] mb-3">사용자 유형을 선택하세요</p>
              {(Object.keys(USER_TYPE_INFO) as UserType[]).map((type) => {
                const typeInfo = USER_TYPE_INFO[type];
                return (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition ${
                      userType === type
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                        : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-primary-300"
                    }`}
                  >
                    <div className={`mt-0.5 ${userType === type ? "text-primary-600" : "text-[var(--muted)]"}`}>
                      {typeInfo.icon}
                    </div>
                    <div>
                      <p className={`font-medium ${userType === type ? "text-primary-600" : "text-[var(--foreground)]"}`}>
                        {typeInfo.label}
                      </p>
                      <p className="text-sm text-[var(--muted)] mt-0.5">{typeInfo.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 transition"
            >
              다음
            </button>
          </>
        )}

        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (info.requiresCompanyEmail || info.requiresDoc) {
                setStep(2);
              } else {
                handleSubmit(e);
              }
            }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 px-3 py-1.5 rounded-lg text-sm font-medium mb-2">
              {info.icon}
              {info.label}로 가입
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="활동할 닉네임"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="6자 이상"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">비밀번호 확인</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="비밀번호 재입력"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 border border-[var(--card-border)] text-[var(--foreground)] py-2.5 rounded-xl font-medium hover:bg-[var(--muted-bg)] transition"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50"
              >
                {info.requiresCompanyEmail ? "다음" : loading ? "가입 중..." : "회원가입"}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: 추가 인증 (HR 담당자 / 헤드헌터) */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-sm font-medium mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              추가 인증 정보
            </div>

            {/* 회사/서치펌 이메일 */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                {userType === "hr_manager" ? "회사 이메일" : "서치펌 이메일"}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => {
                  setCompanyEmail(e.target.value);
                  setCompanyEmailError("");
                }}
                onBlur={() => validateCompanyEmail(companyEmail)}
                className={`w-full bg-[var(--muted-bg)] border rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none ${
                  companyEmailError ? "border-red-500" : "border-[var(--card-border)]"
                }`}
                placeholder={userType === "hr_manager" ? "you@company.co.kr" : "you@searchfirm.co.kr"}
                required
              />
              {companyEmailError && (
                <p className="text-red-500 text-xs mt-1">{companyEmailError}</p>
              )}
              <p className="text-xs text-[var(--muted)] mt-1">
                gmail, naver 등 일반 포털 이메일은 사용할 수 없습니다.
              </p>
            </div>

            {/* 명함/증빙서류 업로드 */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                {userType === "hr_manager" ? "명함 업로드" : "명함 또는 재직증명서 / 사업자등록증"}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-6 text-center hover:border-primary-400 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-primary-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {file.name}
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 mx-auto text-[var(--muted)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm text-[var(--muted)]">
                      클릭하여 파일을 선택하세요
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      JPG, PNG, PDF (최대 5MB)
                    </p>
                  </>
                )}
              </div>
              {userType === "headhunter" && (
                <p className="text-xs text-[var(--muted)] mt-1">
                  프리랜서의 경우 사업자등록증을 업로드해주세요.
                </p>
              )}
            </div>

            {/* HR 담당자 법적 책임 동의 */}
            {userType === "hr_manager" && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 rounded border-[var(--card-border)] text-primary-600 focus:ring-primary-500"
                  required
                />
                <span className="text-sm text-[var(--foreground)]">
                  허위 정보 작성 시 법적 책임을 질 수 있음에 동의합니다.
                  <span className="text-red-500 ml-0.5">*</span>
                </span>
              </label>
            )}

            {/* 헤드헌터 안내 */}
            {userType === "headhunter" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
                <strong>안내:</strong> 헤드헌터 계정은 관리자 검토 후 활성화됩니다.
                제출하신 서류를 바탕으로 1~2 영업일 내 승인 처리됩니다.
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-[var(--card-border)] text-[var(--foreground)] py-2.5 rounded-xl font-medium hover:bg-[var(--muted-bg)] transition"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? "가입 중..." : "회원가입"}
              </button>
            </div>
          </form>
        )}

        {step > 0 && (
          <p className="text-center mt-6 text-sm text-[var(--muted)]">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary-600 hover:underline font-medium">
              로그인
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
