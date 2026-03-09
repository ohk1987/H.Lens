"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { UserType } from "@/lib/types";

const USER_TYPE_INFO: Record<UserType, { label: string; desc: string }> = {
  job_seeker: {
    label: "구직자",
    desc: "헤드헌터 리뷰를 조회하고 작성할 수 있습니다.",
  },
  hr_manager: {
    label: "HR 담당자",
    desc: "채용 관점에서 리뷰 작성, HR 전용 평가 항목 이용 가능.",
  },
  headhunter: {
    label: "헤드헌터",
    desc: "본인 프로필 관리 및 리뷰 답변. 관리자 승인 필요.",
  },
};

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState<UserType>("job_seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyEmailError, setCompanyEmailError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const needsExtraStep = userType !== "job_seeker";

  const validateCompanyEmail = async (val: string) => {
    if (!val) return;
    const res = await fetch("/api/auth/verify-company-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: val }),
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          userType,
          companyEmail: companyEmail || undefined,
          agreedTerms: agreedTerms || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // 파일 업로드
      if (file && data.userId) {
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

        {/* Step 0: 유형 선택 + Google */}
        {step === 0 && (
          <>
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] py-3 rounded-xl font-medium hover:bg-[var(--muted-bg)] transition mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 빠른 가입
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[var(--card-border)]" />
              <span className="text-sm text-[var(--muted)]">이메일로 가입</span>
              <div className="flex-1 h-px bg-[var(--card-border)]" />
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-[var(--foreground)] mb-3">사용자 유형을 선택하세요</p>
              {(Object.keys(USER_TYPE_INFO) as UserType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition ${
                    userType === type
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                      : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-primary-300"
                  }`}
                >
                  <div>
                    <p className={`font-medium ${userType === type ? "text-primary-600" : "text-[var(--foreground)]"}`}>
                      {USER_TYPE_INFO[type].label}
                    </p>
                    <p className="text-sm text-[var(--muted)] mt-0.5">{USER_TYPE_INFO[type].desc}</p>
                  </div>
                </button>
              ))}
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
              if (needsExtraStep) setStep(2);
              else handleSubmit(e);
            }}
            className="space-y-4"
          >
            <div className="text-xs text-primary-600 font-medium mb-2">
              {USER_TYPE_INFO[userType].label}로 가입
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">이름</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="활동할 이름" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">이메일</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="6자 이상" minLength={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">비밀번호 확인</label>
              <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="비밀번호 재입력" minLength={6} required />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(0)}
                className="flex-1 border border-[var(--card-border)] text-[var(--foreground)] py-2.5 rounded-xl font-medium hover:bg-[var(--muted-bg)] transition">
                이전
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50">
                {needsExtraStep ? "다음" : loading ? "가입 중..." : "회원가입"}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: 추가 인증 (HR / 헤드헌터) */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-2">추가 인증 정보</div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                {userType === "hr_manager" ? "회사 이메일" : "서치펌 이메일"} <span className="text-red-500">*</span>
              </label>
              <input type="email" value={companyEmail}
                onChange={(e) => { setCompanyEmail(e.target.value); setCompanyEmailError(""); }}
                onBlur={() => validateCompanyEmail(companyEmail)}
                className={`w-full bg-[var(--muted-bg)] border rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none ${
                  companyEmailError ? "border-red-500" : "border-[var(--card-border)]"
                }`}
                placeholder={userType === "hr_manager" ? "you@company.co.kr" : "you@searchfirm.co.kr"}
                required />
              {companyEmailError && <p className="text-red-500 text-xs mt-1">{companyEmailError}</p>}
              <p className="text-xs text-[var(--muted)] mt-1">gmail, naver 등 일반 이메일은 사용 불가</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                {userType === "hr_manager" ? "명함 업로드" : "명함/재직증명서/사업자등록증"} <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-6 text-center hover:border-primary-400 transition cursor-pointer relative">
                <input type="file" accept="image/*,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer" required />
                {file ? (
                  <p className="text-sm text-primary-600">{file.name}</p>
                ) : (
                  <p className="text-sm text-[var(--muted)]">JPG, PNG, PDF (최대 5MB)</p>
                )}
              </div>
            </div>

            {userType === "hr_manager" && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 rounded border-[var(--card-border)] text-primary-600 focus:ring-primary-500" required />
                <span className="text-sm text-[var(--foreground)]">
                  허위 정보 작성 시 법적 책임을 질 수 있음에 동의합니다. <span className="text-red-500">*</span>
                </span>
              </label>
            )}

            {userType === "headhunter" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
                <strong>안내:</strong> 관리자 검토 후 1~2 영업일 내 활성화됩니다.
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 border border-[var(--card-border)] text-[var(--foreground)] py-2.5 rounded-xl font-medium hover:bg-[var(--muted-bg)] transition">
                이전
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50">
                {loading ? "가입 중..." : "회원가입"}
              </button>
            </div>
          </form>
        )}

        {step > 0 && (
          <p className="text-center mt-6 text-sm text-[var(--muted)]">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary-600 hover:underline font-medium">로그인</Link>
          </p>
        )}
      </div>
    </div>
  );
}
