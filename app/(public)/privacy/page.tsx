export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">개인정보처리방침</h1>
      <p className="text-sm text-[var(--muted)] mb-10">시행일: 2024년 1월 1일</p>

      <div className="space-y-10 text-sm leading-relaxed">
        <section>
          <p className="text-[var(--muted)]">
            H.Lens(이하 &quot;회사&quot;)는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등
            관련 법령을 준수합니다. 본 개인정보처리방침은 회사가 수집하는 개인정보의 항목, 수집 목적,
            보유 기간 등을 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">1. 수집하는 개인정보 항목</h2>
          <div className="space-y-4">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
              <h3 className="font-medium text-[var(--foreground)] mb-2">회원 가입 시</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                <li>이메일 주소, 비밀번호(이메일 가입 시)</li>
                <li>이름(닉네임), 프로필 이미지</li>
                <li>회원 유형(구직자/HR 담당자/헤드헌터)</li>
              </ul>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
              <h3 className="font-medium text-[var(--foreground)] mb-2">소셜 로그인 시 (Google OAuth, Kakao)</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                <li>Google: 이메일 주소, 이름, 프로필 사진</li>
                <li>Kakao: 이메일 주소, 닉네임, 프로필 이미지</li>
                <li>소셜 계정 고유 식별자(ID)</li>
              </ul>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
              <h3 className="font-medium text-[var(--foreground)] mb-2">HR 담당자 / 헤드헌터 인증 시</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                <li>회사/서치펌 이메일 주소</li>
                <li>명함, 재직증명서, 사업자등록증 이미지</li>
              </ul>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
              <h3 className="font-medium text-[var(--foreground)] mb-2">서비스 이용 시 자동 수집</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                <li>접속 IP 주소, 접속 일시, 브라우저 종류</li>
                <li>서비스 이용 기록, 접속 로그</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">2. 개인정보 수집 및 이용 목적</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]">수집 목적</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]">수집 항목</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--card-border)]">
                  <td className="py-3 px-4">회원 식별 및 가입 관리</td>
                  <td className="py-3 px-4">이메일, 이름, 비밀번호</td>
                </tr>
                <tr className="border-b border-[var(--card-border)]">
                  <td className="py-3 px-4">HR 담당자/헤드헌터 본인 인증</td>
                  <td className="py-3 px-4">회사 이메일, 명함/재직증명서</td>
                </tr>
                <tr className="border-b border-[var(--card-border)]">
                  <td className="py-3 px-4">리뷰 작성자 신뢰도 관리</td>
                  <td className="py-3 px-4">회원 유형, 인증 상태</td>
                </tr>
                <tr className="border-b border-[var(--card-border)]">
                  <td className="py-3 px-4">서비스 개선 및 통계 분석</td>
                  <td className="py-3 px-4">접속 로그, 이용 기록</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">고객 문의 대응</td>
                  <td className="py-3 px-4">이메일, 문의 내용</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">3. 개인정보 보유 및 이용 기간</h2>
          <ul className="list-disc list-inside space-y-2 text-[var(--muted)]">
            <li><strong className="text-[var(--foreground)]">회원 정보:</strong> 회원 탈퇴 시까지 (탈퇴 후 30일 이내 파기)</li>
            <li><strong className="text-[var(--foreground)]">인증 서류:</strong> 인증 완료 후 6개월 보관 후 파기</li>
            <li><strong className="text-[var(--foreground)]">접속 로그:</strong> 3개월 보관 후 파기</li>
            <li><strong className="text-[var(--foreground)]">리뷰 데이터:</strong> 서비스 운영 기간 동안 보관 (탈퇴 시 익명화 처리)</li>
          </ul>
          <p className="text-[var(--muted)] mt-3">
            단, 관련 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">4. 개인정보의 제3자 제공</h2>
          <p className="text-[var(--muted)]">
            회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted)] mt-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 의해 요구되는 경우</li>
            <li>서비스 제공에 필요한 최소한의 범위에서 업무 위탁이 필요한 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">5. 개인정보 처리 위탁</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]">위탁 업체</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]">위탁 업무</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)]">
                <tr className="border-b border-[var(--card-border)]">
                  <td className="py-3 px-4">Supabase Inc.</td>
                  <td className="py-3 px-4">데이터베이스 호스팅 및 인증 서비스</td>
                </tr>
                <tr className="border-b border-[var(--card-border)]">
                  <td className="py-3 px-4">Vercel Inc.</td>
                  <td className="py-3 px-4">웹 서비스 호스팅</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Google LLC</td>
                  <td className="py-3 px-4">소셜 로그인(OAuth) 인증</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">6. Google OAuth 관련 안내</h2>
          <p className="text-[var(--muted)]">
            H.Lens는 Google OAuth 2.0을 통해 로그인 서비스를 제공합니다. Google 로그인 시 수집되는 정보는
            이메일 주소, 이름, 프로필 사진에 한정되며, Google 계정의 비밀번호는 수집하지 않습니다.
            Google 계정 연동은 언제든지 Google 계정 설정에서 해제할 수 있습니다.
            회사는 Google API 서비스 이용 시{" "}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              Google API 서비스 사용자 데이터 정책
            </a>
            을 준수합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">7. 정보 주체의 권리</h2>
          <p className="text-[var(--muted)] mb-2">이용자는 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
            <li>개인정보 열람, 정정, 삭제, 처리 정지 요청</li>
            <li>회원 탈퇴를 통한 개인정보 삭제</li>
            <li>마케팅 수신 동의 철회</li>
          </ul>
          <p className="text-[var(--muted)] mt-2">
            권리 행사는 마이페이지 또는 고객센터(support@hlens.app)를 통해 가능합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">8. 개인정보 보호 책임자</h2>
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 text-[var(--muted)]">
            <p>개인정보 보호 책임자: H.Lens 운영팀</p>
            <p>이메일: privacy@hlens.app</p>
            <p className="mt-2">
              개인정보 침해에 대한 신고·상담은 개인정보침해신고센터(privacy.kisa.or.kr),
              대검찰청 사이버수사과(spo.go.kr), 경찰청 사이버안전국(cyberbureau.police.go.kr)에
              문의하실 수 있습니다.
            </p>
          </div>
        </section>

        <section className="border-t border-[var(--card-border)] pt-6">
          <p className="text-[var(--muted)]">
            본 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
