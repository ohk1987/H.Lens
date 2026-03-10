import Link from "next/link";

const STEPS = [
  {
    step: "1",
    title: "회원가입",
    desc: "H.Lens에 가입하고, 사용자 유형으로 '헤드헌터'를 선택합니다. 서치펌 이메일 주소를 입력하고 인증을 완료해주세요.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
  },
  {
    step: "2",
    title: "서류 제출",
    desc: "재직증명서 또는 명함을 업로드합니다. 프리랜서 헤드헌터의 경우 사업자등록증을 제출해주세요. 서류는 인증 용도로만 사용됩니다.",
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
  },
  {
    step: "3",
    title: "관리자 승인",
    desc: "제출하신 서류를 바탕으로 관리자가 검토합니다. 영업일 기준 1~2일 이내 승인이 완료되며, 승인 결과는 이메일로 안내됩니다.",
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
  },
];

const VERIFICATION_LEVELS = [
  {
    level: "미인증",
    desc: "리뷰어에 의해 등록된 헤드헌터 프로필입니다. 아직 본인이 클레임하지 않은 상태입니다.",
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  {
    level: "본인 인증",
    desc: "헤드헌터 본인이 프로필을 클레임하고, 서치펌 이메일 인증 + 관리자 승인을 완료한 상태입니다.",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    level: "재직 인증",
    desc: "재직증명서를 제출하고 관리자 확인이 완료된 가장 높은 인증 등급입니다. 프로필에 초록색 배지가 표시됩니다.",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

const BENEFITS = [
  {
    title: "온라인 평판 관리",
    desc: "본인 프로필을 직접 관리하고, 전문 분야와 경력 정보를 업데이트할 수 있습니다.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: "후보자 신뢰 확보",
    desc: "인증 배지와 리뷰 답변을 통해 후보자에게 신뢰감을 전달할 수 있습니다.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "리뷰 답변 기능",
    desc: "리뷰에 답변을 작성하여 피드백에 대응하고 소통할 수 있습니다.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    title: "성과 분석",
    desc: "리뷰 통계와 평점 트렌드를 확인하여 서비스 품질을 개선할 수 있습니다.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function HeadhunterRegisterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3">헤드헌터 등록 안내</h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto">
          H.Lens에 헤드헌터로 등록하면 온라인 평판을 관리하고,
          후보자에게 신뢰를 전달할 수 있습니다.
        </p>
      </div>

      {/* 등록 장점 */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-5">등록 혜택</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 flex gap-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <h3 className="font-medium text-[var(--foreground)] mb-1">{b.title}</h3>
                <p className="text-sm text-[var(--muted)]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 등록 프로세스 */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-5">등록 프로세스</h2>
        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${s.color}`}>
                {s.step}
              </div>
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 flex-1">
                <h3 className="font-semibold text-[var(--foreground)] mb-1">{s.title}</h3>
                <p className="text-sm text-[var(--muted)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 인증 등급 */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-5">인증 등급</h2>
        <div className="space-y-3">
          {VERIFICATION_LEVELS.map((v) => (
            <div key={v.level} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 flex items-start gap-4">
              <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 mt-0.5 ${v.color}`}>
                {v.level}
              </span>
              <p className="text-sm text-[var(--muted)]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">
          지금 헤드헌터로 등록하세요
        </h2>
        <p className="text-sm text-[var(--muted)] mb-6 max-w-md mx-auto">
          H.Lens에서 전문성을 인정받고 후보자와의 신뢰를 쌓아보세요.
          등록은 무료이며, 승인까지 1~2 영업일이 소요됩니다.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-700 transition"
        >
          지금 등록하기
        </Link>
      </div>
    </div>
  );
}
