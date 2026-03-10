"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isCompanyEmail } from "@/lib/types";

export default function HeadhunterVerifyPage() {
  const { update } = useSession();
  const router = useRouter();
  const [companyEmail, setCompanyEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!companyEmail) {
      setEmailError("서치펌 이메일을 입력해주세요.");
      return false;
    }
    if (!isCompanyEmail(companyEmail)) {
      setEmailError("일반 포털 이메일은 사용할 수 없습니다.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    if (!file) { setError("서류를 업로드해주세요."); return; }

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

      // 2. 추가 정보 저장
      const res = await fetch("/api/auth/verify-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "인증 정보 저장에 실패했습니다.");
        setLoading(false);
        return;
      }

      // 세션 업데이트 (pending 상태)
      await update({ userType: "headhunter", status: "pending" });
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
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            헤드헌터 인증
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">헤드헌터 인증 정보</h1>
          <p className="text-[var(--muted)] mt-2">관리자 검토 후 계정이 활성화됩니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 서치펌 이메일 */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              서치펌 이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={companyEmail}
              onChange={(e) => { setCompanyEmail(e.target.value); setEmailError(""); }}
              onBlur={validateEmail}
              className={`w-full bg-[var(--muted-bg)] border rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none ${
                emailError ? "border-red-500" : "border-[var(--card-border)]"
              }`}
              placeholder="you@searchfirm.co.kr"
              required
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          {/* 프리랜서 체크 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFreelancer}
              onChange={(e) => setIsFreelancer(e.target.checked)}
              className="rounded border-[var(--card-border)] text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-[var(--foreground)]">프리랜서 헤드헌터입니다</span>
          </label>

          {/* 서류 업로드 */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              {isFreelancer ? "사업자등록증" : "명함 또는 재직증명서"} <span className="text-red-500">*</span>
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
                  {isFreelancer && (
                    <p className="text-xs text-[var(--muted)] mt-1">프리랜서는 사업자등록증을 업로드해주세요.</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 안내 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
            <strong>안내:</strong> 제출하신 서류를 바탕으로 1~2 영업일 내 승인 처리됩니다.
            승인 완료 시 이메일로 알려드립니다.
          </div>

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
