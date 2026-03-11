import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--muted-bg)]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* 브랜드 */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-primary-600">
              H.Lens
            </Link>
            <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">
              신뢰할 수 있는 헤드헌터를 찾는
              <br />
              가장 투명한 방법
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">서비스</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/headhunters" className="hover:text-primary-600 transition">헤드헌터 찾기</Link></li>
              <li><Link href="/articles" className="hover:text-primary-600 transition">아티클</Link></li>
              <li><Link href="/reviews/new" className="hover:text-primary-600 transition">리뷰 작성</Link></li>
              <li><Link href="/signup" className="hover:text-primary-600 transition">회원가입</Link></li>
            </ul>
          </div>

          {/* 정보 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">정보</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/about" className="hover:text-primary-600 transition">회사 소개</Link></li>
              <li><Link href="/terms" className="hover:text-primary-600 transition">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-600 transition">개인정보처리방침</Link></li>
              <li><Link href="/review-guidelines" className="hover:text-primary-600 transition">리뷰 가이드라인</Link></li>
            </ul>
          </div>

          {/* 문의 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">문의</h4>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li><Link href="/support" className="hover:text-primary-600 transition">고객센터</Link></li>
              <li><Link href="/partnership" className="hover:text-primary-600 transition">제휴 문의</Link></li>
              <li><Link href="/headhunter-register" className="hover:text-primary-600 transition">헤드헌터 등록</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--card-border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--muted)]">
            &copy; 2024 H.Lens. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            H.Lens는 헤드헌터 리뷰 정보를 제공하며, 채용 알선을 하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
