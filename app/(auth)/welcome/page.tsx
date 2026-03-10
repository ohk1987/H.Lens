"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.replace("/");
      return;
    }
    // is_welcomed를 true로 업데이트
    fetch("/api/auth/welcome", { method: "POST" }).catch(() => {});
    setReady(true);
  }, [session, status, router]);

  if (!ready) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-8">
          <span className="text-4xl">🎉</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3">
          H.Lens에 오신 것을 환영합니다!
        </h1>

        <p className="text-lg text-[var(--muted)] mb-2">
          회원가입이 완료되었습니다
        </p>

        <p className="text-sm text-[var(--muted)] mb-10">
          {session?.user?.name || session?.user?.email}님, 이제 H.Lens의 모든 기능을 이용하실 수 있습니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3 border border-[var(--card-border)] text-[var(--foreground)] rounded-xl font-medium hover:bg-[var(--muted-bg)] transition"
          >
            홈으로 이동
          </Link>
          <Link
            href="/reviews/new"
            className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition"
          >
            리뷰 작성하기
          </Link>
        </div>
      </div>
    </div>
  );
}
