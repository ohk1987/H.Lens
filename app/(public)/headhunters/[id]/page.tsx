"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import HeadhunterProfile from "@/components/headhunter/HeadhunterProfile";
import ReviewList from "@/components/headhunter/ReviewList";

export default function HeadhunterDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-6 flex items-center gap-2">
        <Link href="/headhunters" className="hover:text-primary-600 transition">헤드헌터</Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">프로필</span>
      </nav>

      <HeadhunterProfile id={id} />

      <div className="mt-8">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">리뷰</h2>
        <ReviewList headhunterId={id} />
      </div>
    </div>
  );
}
