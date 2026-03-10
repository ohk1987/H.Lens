import Link from "next/link";

export default function ReviewGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">리뷰 가이드라인</h1>
      <p className="text-[var(--muted)] mb-10">
        H.Lens의 리뷰는 구직자와 HR 담당자 모두에게 신뢰할 수 있는 정보를 제공하기 위해 존재합니다.
        아래 가이드라인을 참고하여 양질의 리뷰를 작성해주세요.
      </p>

      <div className="space-y-10 text-sm leading-relaxed">
        {/* 좋은 리뷰 작성 방법 */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg flex items-center justify-center text-base">1</span>
            좋은 리뷰 작성 방법
          </h2>
          <div className="space-y-3">
            {[
              { title: "구체적인 경험을 작성하세요", desc: "\"좋았다\" 대신 어떤 상황에서, 어떻게 도움을 받았는지 구체적으로 작성해주세요. 예: \"이력서 피드백을 3번에 걸쳐 상세하게 해주셨고, 면접 전날 예상 질문 리스트를 공유해주셨습니다.\"" },
              { title: "객관적으로 평가하세요", desc: "감정보다는 사실에 기반하여 작성해주세요. 전문성, 소통, 신뢰성, 지원, 투명성 5가지 항목을 균형 있게 평가해주세요." },
              { title: "0.5점 단위로 세밀하게 평점을 매겨주세요", desc: "각 항목을 0.5점 단위로 평가할 수 있습니다. 3점은 보통, 4점은 만족, 5점은 탁월함을 의미합니다." },
              { title: "키워드를 활용하세요", desc: "긍정/부정 키워드를 선택하면 다른 사용자가 핵심을 빠르게 파악할 수 있습니다. 최대 3개씩 선택 가능합니다." },
              { title: "채용 진행 상황을 함께 알려주세요", desc: "채용 프로세스가 어디까지 진행되었는지(진행 중, 합격, 불합격, 중도 포기) 함께 기재하면 리뷰의 맥락이 더 풍부해집니다." },
            ].map((item) => (
              <div key={item.title} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
                <h3 className="font-medium text-[var(--foreground)] mb-1">{item.title}</h3>
                <p className="text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 금지 내용 */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg flex items-center justify-center text-base">2</span>
            금지되는 내용
          </h2>
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-5">
            <ul className="space-y-3 text-[var(--muted)]">
              {[
                { label: "허위 리뷰", desc: "실제 경험하지 않은 내용을 작성하거나, 사실과 다른 정보를 기재하는 행위" },
                { label: "욕설 및 비방", desc: "인격 모독, 욕설, 비속어, 성적·인종적 비하 표현을 포함하는 행위" },
                { label: "개인정보 노출", desc: "헤드헌터 또는 제3자의 개인 연락처, 주소, 주민등록번호 등을 공개하는 행위" },
                { label: "대가성 리뷰", desc: "금전적 보상, 편의 제공 등을 조건으로 작성된 리뷰" },
                { label: "경쟁 목적 리뷰", desc: "경쟁 관계에 있는 헤드헌터나 서치펌을 폄하할 목적으로 작성된 리뷰" },
                { label: "중복 리뷰", desc: "동일한 헤드헌터에 대해 같은 채용 건으로 여러 번 리뷰를 작성하는 행위" },
                { label: "광고성 내용", desc: "특정 서비스나 상품의 홍보를 목적으로 하는 내용" },
              ].map((item) => (
                <li key={item.label} className="flex gap-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span><strong className="text-[var(--foreground)]">{item.label}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 증빙 자료 */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center text-base">3</span>
            증빙 자료 안내
          </h2>
          <p className="text-[var(--muted)] mb-3">
            증빙 자료를 제출하면 &quot;인증 리뷰&quot;로 표시되어 더 높은 신뢰도를 받습니다.
            다음과 같은 자료를 증빙으로 제출할 수 있습니다:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "헤드헌터와 주고받은 이메일 캡처",
              "채용 포지션 제안 메시지 캡처",
              "헤드헌터 명함 사진",
              "면접 일정 안내 메일/문자",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[var(--muted)]">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)] mt-3">
            * 증빙 자료는 리뷰 신뢰도 검증에만 사용되며, 다른 사용자에게 공개되지 않습니다.
            * 개인정보가 포함된 부분은 가려서 제출해주세요.
          </p>
        </section>

        {/* 리뷰 삭제 기준 */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg flex items-center justify-center text-base">4</span>
            리뷰 삭제 기준
          </h2>
          <p className="text-[var(--muted)] mb-3">다음에 해당하는 리뷰는 사전 통지 없이 삭제될 수 있습니다:</p>
          <ul className="space-y-2 text-[var(--muted)]">
            {[
              "위 금지 내용에 해당하는 리뷰",
              "실제 경험에 기반하지 않은 것으로 확인된 리뷰",
              "동일인이 계정을 변경하며 작성한 중복 리뷰",
              "법원의 삭제 명령 또는 법적 요청에 의한 경우",
              "헤드헌터의 정당한 이의 제기가 인정된 경우",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[var(--muted)] mt-3">
            리뷰 삭제를 요청하려면 <Link href="/support" className="text-primary-600 hover:underline">고객센터</Link>를 통해 문의해주세요.
          </p>
        </section>

        {/* 헤드헌터 응답 권리 */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg flex items-center justify-center text-base">5</span>
            헤드헌터 응답 권리
          </h2>
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 space-y-3 text-[var(--muted)]">
            <p>
              H.Lens는 헤드헌터의 의견 표명 권리를 존중합니다. 본인 인증을 완료한 헤드헌터는 다음과 같은 권리를 가집니다:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>본인 프로필에 게시된 모든 리뷰에 대해 답변을 작성할 수 있습니다.</li>
              <li>사실과 다른 리뷰에 대해 이의를 제기할 수 있습니다.</li>
              <li>이의 제기 시 관련 증빙 자료를 함께 제출할 수 있습니다.</li>
              <li>회사는 양측의 자료를 검토한 후 공정하게 판단합니다.</li>
            </ul>
            <p>
              헤드헌터 답변은 해당 리뷰 하단에 표시되며, 리뷰 내용을 삭제하거나 수정하는 것은 아닙니다.
            </p>
          </div>
        </section>

        <section className="border-t border-[var(--card-border)] pt-6">
          <p className="text-[var(--muted)]">
            본 가이드라인은 서비스 운영 상황에 따라 변경될 수 있으며, 변경 시 서비스 내 공지를 통해 안내합니다.
            리뷰 관련 문의사항은 <Link href="/support" className="text-primary-600 hover:underline">고객센터</Link>로 연락해주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
