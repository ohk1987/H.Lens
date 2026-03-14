"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const findRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const isActiveHeadhunter =
    session?.user?.userType === "headhunter" &&
    session?.user?.status === "active";

  // 드롭다운 외부 클릭 시 닫힘
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (findRef.current && !findRef.current.contains(e.target as Node)) {
        setFindOpen(false);
      }
    }
    if (findOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [findOpen]);

  return (
    <header className="border-b border-[var(--card-border)] bg-[var(--card-bg)] sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary-600">
          H.Lens
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* 찾기 드롭다운 */}
          <div className="relative" ref={findRef}>
            <button
              onClick={() => setFindOpen(!findOpen)}
              className="text-sm text-[var(--muted)] hover:text-primary-600 transition flex items-center gap-1"
            >
              찾기
              <svg
                className={`w-3.5 h-3.5 transition-transform ${findOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {findOpen && (
              <div className="absolute top-full left-0 mt-2 w-44 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-lg py-1 z-50">
                <Link
                  href="/headhunters"
                  className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition"
                  onClick={() => setFindOpen(false)}
                >
                  헤드헌터 찾기
                </Link>
                <Link
                  href="/firms"
                  className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition"
                  onClick={() => setFindOpen(false)}
                >
                  서치펌 찾기
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/articles"
            className="text-sm text-[var(--muted)] hover:text-primary-600 transition"
          >
            아티클
          </Link>

          {/* 헤드헌터: 내 대시보드, 기타: 리뷰 작성 */}
          {isActiveHeadhunter ? (
            <Link
              href="/dashboard/headhunter"
              className="text-sm text-[var(--muted)] hover:text-primary-600 transition"
            >
              내 대시보드
            </Link>
          ) : (
            <Link
              href="/reviews/new"
              className="text-sm text-[var(--muted)] hover:text-primary-600 transition"
            >
              리뷰 작성
            </Link>
          )}

          <Link
            href="/community"
            className="text-sm text-[var(--muted)] hover:text-primary-600 transition"
          >
            커뮤니티
          </Link>

          {session?.user ? (
            <>
              <Link href="/my" className="text-sm text-[var(--muted)] hover:text-primary-600 transition">
                마이페이지
              </Link>
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              로그인
            </Link>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg
              text-[var(--foreground)] hover:bg-[var(--muted-bg)] transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Overlay + Nav */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/30 z-40 md:hidden"
          onClick={() => { setMobileOpen(false); setFindOpen(false); }}
        />
      )}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-4 space-y-3 relative z-50">
          {/* 찾기 드롭다운 (모바일) */}
          <div>
            <button
              onClick={() => setFindOpen(!findOpen)}
              className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-primary-600"
            >
              찾기
              <svg
                className={`w-3.5 h-3.5 transition-transform ${findOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {findOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <Link
                  href="/headhunters"
                  className="block text-sm text-[var(--muted)] hover:text-primary-600"
                  onClick={() => { setFindOpen(false); setMobileOpen(false); }}
                >
                  헤드헌터 찾기
                </Link>
                <Link
                  href="/firms"
                  className="block text-sm text-[var(--muted)] hover:text-primary-600"
                  onClick={() => { setFindOpen(false); setMobileOpen(false); }}
                >
                  서치펌 찾기
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/articles"
            className="block text-sm text-[var(--muted)] hover:text-primary-600"
            onClick={() => setMobileOpen(false)}
          >
            아티클
          </Link>

          {isActiveHeadhunter ? (
            <Link
              href="/dashboard/headhunter"
              className="block text-sm text-[var(--muted)] hover:text-primary-600"
              onClick={() => setMobileOpen(false)}
            >
              내 대시보드
            </Link>
          ) : (
            <Link
              href="/reviews/new"
              className="block text-sm text-[var(--muted)] hover:text-primary-600"
              onClick={() => setMobileOpen(false)}
            >
              리뷰 작성
            </Link>
          )}

          <Link
            href="/community"
            className="block text-sm text-[var(--muted)] hover:text-primary-600"
            onClick={() => setMobileOpen(false)}
          >
            커뮤니티
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/my"
                className="block text-sm text-[var(--muted)] hover:text-primary-600"
                onClick={() => setMobileOpen(false)}
              >
                마이페이지
              </Link>
              <button onClick={handleLogout} className="block text-sm text-[var(--muted)]">
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block text-sm text-primary-600 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              로그인
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
