"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="border-b border-[var(--card-border)] bg-[var(--card-bg)] sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary-600">
          H.Lens
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/headhunters" className="text-sm text-[var(--muted)] hover:text-primary-600 transition">
            헤드헌터
          </Link>
          <Link href="/reviews/new" className="text-sm text-[var(--muted)] hover:text-primary-600 transition">
            리뷰 작성
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

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-4 space-y-3">
          <Link href="/headhunters" className="block text-sm text-[var(--muted)] hover:text-primary-600">
            헤드헌터
          </Link>
          <Link href="/reviews/new" className="block text-sm text-[var(--muted)] hover:text-primary-600">
            리뷰 작성
          </Link>
          {session?.user ? (
            <>
              <Link href="/my" className="block text-sm text-[var(--muted)] hover:text-primary-600">
                마이페이지
              </Link>
              <button onClick={handleLogout} className="block text-sm text-[var(--muted)]">
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className="block text-sm text-primary-600 font-medium">
              로그인
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
