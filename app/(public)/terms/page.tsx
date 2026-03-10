export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">이용약관</h1>
      <p className="text-sm text-[var(--muted)] mb-10">시행일: 2024년 1월 1일</p>

      <div className="prose-custom space-y-10 text-[var(--foreground)] text-sm leading-relaxed">
        {/* 제1조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제1조 (목적)</h2>
          <p className="text-[var(--muted)]">
            이 약관은 H.Lens(이하 &quot;회사&quot;)가 제공하는 헤드헌터 리뷰 플랫폼 서비스(이하 &quot;서비스&quot;)의
            이용 조건 및 절차, 회사와 이용자의 권리·의무·책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        {/* 제2조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제2조 (정의)</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>&quot;서비스&quot;란 회사가 운영하는 H.Lens 웹사이트 및 관련 제반 서비스를 의미합니다.</li>
            <li>&quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>&quot;회원&quot;이란 회사에 회원 가입을 한 자로서, 구직자, HR 담당자, 헤드헌터를 포함합니다.</li>
            <li>&quot;리뷰&quot;란 이용자가 헤드헌터에 대해 작성하는 평가, 평점, 키워드 등의 정보를 의미합니다.</li>
            <li>&quot;헤드헌터 프로필&quot;이란 서비스에 등록된 헤드헌터의 정보 및 리뷰 통계 페이지를 의미합니다.</li>
          </ol>
        </section>

        {/* 제3조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제3조 (약관의 효력 및 변경)</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
            <li>회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 시행일 7일 전부터 공지합니다.</li>
            <li>변경된 약관에 동의하지 않는 이용자는 회원 탈퇴를 할 수 있으며, 시행일 이후 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 봅니다.</li>
          </ol>
        </section>

        {/* 제4조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제4조 (회원 가입 및 탈퇴)</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>회원 가입은 이용자가 본 약관에 동의하고, 회사가 정한 가입 양식에 따라 정보를 기입한 후 가입 신청을 하면 완료됩니다.</li>
            <li>회원은 구글(Google) 계정, 카카오 계정, 또는 이메일/비밀번호를 통해 가입할 수 있습니다.</li>
            <li>회원은 회원 유형(구직자, HR 담당자, 헤드헌터) 중 하나를 선택해야 하며, HR 담당자와 헤드헌터는 추가 인증 절차가 필요합니다.</li>
            <li>회원은 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 또는 합리적인 기간 내에 처리합니다.</li>
            <li>탈퇴 시 회원이 작성한 리뷰는 익명화되어 유지되거나, 요청에 따라 삭제될 수 있습니다.</li>
          </ol>
        </section>

        {/* 제5조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제5조 (서비스의 제공)</h2>
          <p className="text-[var(--muted)] mb-2">회사는 다음과 같은 서비스를 제공합니다:</p>
          <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
            <li>헤드헌터 프로필 열람 및 검색</li>
            <li>헤드헌터 리뷰 작성 및 열람</li>
            <li>서치펌 정보 열람</li>
            <li>채용 시장 관련 아티클 제공</li>
            <li>헤드헌터 본인 프로필 클레임 및 관리</li>
            <li>기타 회사가 정하는 서비스</li>
          </ul>
        </section>

        {/* 제6조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제6조 (리뷰 작성 규칙)</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>리뷰는 실제 경험에 기반하여 작성해야 하며, 허위 또는 과장된 내용을 포함해서는 안 됩니다.</li>
            <li>리뷰에는 5개 평가 항목(전문성, 소통 및 대응, 신뢰성 및 윤리, 지원 및 코칭, 투명성)에 대한 평점과 상세 내용을 포함해야 합니다.</li>
            <li>증빙 자료(명함, 이메일 캡처 등)를 제출한 리뷰는 &quot;인증 리뷰&quot;로 표시되며 더 높은 신뢰도를 부여받습니다.</li>
            <li>동일한 헤드헌터에 대해 동일한 채용 건으로 중복 리뷰를 작성할 수 없습니다.</li>
            <li>리뷰 작성자는 본인의 리뷰에 대해 법적 책임을 집니다.</li>
          </ol>
        </section>

        {/* 제7조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제7조 (금지 행위)</h2>
          <p className="text-[var(--muted)] mb-2">이용자는 다음 각 호의 행위를 해서는 안 됩니다:</p>
          <ol className="list-decimal list-inside space-y-1 text-[var(--muted)]">
            <li>허위 리뷰 또는 악의적 목적의 리뷰 작성</li>
            <li>타인의 개인정보(실명, 연락처 등)를 리뷰에 노출하는 행위</li>
            <li>욕설, 비방, 명예훼손에 해당하는 내용 작성</li>
            <li>리뷰 조작 또는 대가성 리뷰 작성</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>타인의 계정을 도용하거나 부정 가입하는 행위</li>
            <li>회사의 사전 동의 없이 서비스 정보를 크롤링하거나 수집하는 행위</li>
            <li>기타 관련 법령에 위반되는 행위</li>
          </ol>
        </section>

        {/* 제8조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제8조 (리뷰 관리)</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>회사는 제7조에 해당하는 리뷰를 사전 통지 없이 삭제하거나 비공개 처리할 수 있습니다.</li>
            <li>헤드헌터는 본인 프로필에 게시된 리뷰에 대해 답변을 작성할 수 있습니다.</li>
            <li>리뷰 삭제를 원하는 경우 고객센터를 통해 요청할 수 있으며, 회사는 내부 검토 후 처리합니다.</li>
            <li>회사는 리뷰의 진실성을 보장하지 않으며, 리뷰 내용에 대한 책임은 작성자에게 있습니다.</li>
          </ol>
        </section>

        {/* 제9조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제9조 (헤드헌터 프로필 클레임)</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>헤드헌터는 서비스에 등록된 본인 프로필에 대해 클레임(소유권 주장)을 할 수 있습니다.</li>
            <li>클레임은 서치펌 이메일 인증 및 관리자 승인을 통해 처리됩니다.</li>
            <li>클레임 완료 후 헤드헌터는 프로필 정보 수정, 리뷰 답변 작성 등의 기능을 이용할 수 있습니다.</li>
            <li>허위 클레임이 확인될 경우 계정 정지 및 법적 조치가 취해질 수 있습니다.</li>
          </ol>
        </section>

        {/* 제10조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제10조 (책임 제한)</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>회사는 이용자가 작성한 리뷰의 정확성, 완전성, 신뢰성을 보증하지 않습니다.</li>
            <li>회사는 서비스 이용으로 인한 이용자 간 또는 이용자와 제3자 간의 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임이 없습니다.</li>
            <li>회사는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
            <li>H.Lens는 채용 정보를 제공하는 플랫폼이며, 직접적인 채용 알선 또는 직업 소개를 하지 않습니다.</li>
          </ol>
        </section>

        {/* 제11조 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">제11조 (분쟁 해결)</h2>
          <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
            <li>본 약관과 관련된 분쟁은 대한민국 법률에 따라 해석되고 처리됩니다.</li>
            <li>서비스 이용과 관련하여 분쟁이 발생한 경우, 양 당사자는 원만한 해결을 위해 성실히 협의합니다.</li>
            <li>협의가 이루어지지 않을 경우, 관할 법원에 소를 제기할 수 있습니다.</li>
          </ol>
        </section>

        <section className="border-t border-[var(--card-border)] pt-6">
          <p className="text-[var(--muted)]">
            본 약관은 2024년 1월 1일부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
