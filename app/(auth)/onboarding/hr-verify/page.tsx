"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isCompanyEmail } from "@/lib/types";

export default function HrVerifyPage() {
  const { update } = useSession();
  const router = useRouter();
  const [companyEmail, setCompanyEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!companyEmail) {
      setEmailError("회사 이메일을 입력해주세요.");
      return false;
    }
    if (!isCompanyEmail(companyEmail)) {
      setEmailError("일반 포털 이메일(gmail, naver 등)은 사용할 수 없습니다.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    if (!file) { setError("명함을 업로드해주세요."); return; }
    if (!agreed) { setError("법적 책임 동의가 필요합니다."); return; }

    setLoading(true);
    setError("");

    try {
      // 1. 파일 업로드
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload/verification-doc", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadData = await uploadRes.json();
        setError(uploadData.error || "파일 업로드에 실패했습니다.");
        setLoading(false);
        return;
      }

      // 2. HR 추가 정보 저장
      const res = await fetch("/api/auth/verify-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyEmail,
          agreedTerms: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "인증 정보 저장에 실패했습니다.");
        setLoading(false);
        return;
      }

      // 세션 업데이트
      await update({ userType: "hr_manager", status: "active" });
      router.push("/welcome");
    } catch {
      setError("오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-lg text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            HR 담당자 인증
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">추가 인증 정보</h1>
          <p className="text-[var(--muted)] mt-2">HR 담당자 기능을 이용하려면 회사 인증이 필요합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 회사 이메일 */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              회사 이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={companyEmail}
              onChange={(e) => { setCompanyEmail(e.target.value); setEmailError(""); }}
              onBlur={validateEmail}
              className={`w-full bg-[var(--muted-bg)] border rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none ${
                emailError ? "border-red-500" : "border-[var(--card-border)]"
              }`}
              placeholder="you@company.co.kr"
              required
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            <p className="text-xs text-[var(--muted)] mt-1">gmail, naver 등 일반 이메일은 사용할 수 없습니다.</p>
          </div>

          {/* 명함 업로드 */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              명함 업로드 <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-6 text-center hover:border-primary-400 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
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
                  <p className="text-sm text-[var(--muted)]">JPG, PNG, PDF (최대 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* 법적 책임 동의 */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 rounded border-[var(--card-border)] text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-[var(--foreground)]">
              허위 정보 작성 시 법적 책임을 질 수 있음에 동의합니다.
              <span className="text-red-500 ml-0.5">*</span>
            </span>
          </label>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? "제출 중..." : "인증 정보 제출"}
          </button>
        </form>
      </div>
    </div>
  );
}
