import Link from "next/link";

export const metadata = {
  title: "H.Lens 소개 - 헤드헌팅 시장을 투명하게",
  description: "H.Lens는 헤드헌팅 시장을 투명하게 들여다볼 수 있는 렌즈가 됩니다.",
};

const PROBLEM_CARDS = [
  {
    icon: "\u{1F6AB}",
    text: "부정확한 포지션 정보로 지원자 모수 늘리기에 급급",
  },
  {
    icon: "\u{1F4C4}",
    text: "후보자 동의 없이 이력서 무단 유포",
  },
  {
    icon: "\u{1F507}",
    text: "전형 결과조차 안내하지 않는 무책임한 태도",
  },
  {
    icon: "\u{1F4B0}",
    text: "과장된 연봉 정보와 기업 설명으로 기대치만 높이기",
  },
];

const VALUE_CARDS = [
  {
    title: "구직자",
    description: "믿을 수 있는 파트너를 찾을 수 있는 환경",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "HR 담당자",
    description: "검증된 서치펌과 협업할 수 있는 기반",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
      </svg>
    ),
  },
  {
    title: "헤드헌터",
    description: "노력과 전문성으로 정당하게 인정받는 시스템",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0l-4.725 2.885a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-24 md:py-36 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            헤드헌팅 시장을{" "}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              투명하게
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto leading-relaxed">
            H.Lens는 헤드헌팅 시장을 들여다볼 수 있는 렌즈가 됩니다
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z"
              className="fill-[var(--background)]"
            />
          </svg>
        </div>
      </section>

      {/* 섹션 1 - 문제 인식 */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-8 leading-snug">
            채용 시장에서 가장 폐쇄적인 영역,{" "}
            <span className="text-primary-500">헤드헌팅</span>
          </h2>
          <div className="space-y-6 text-[var(--muted)] leading-relaxed text-base md:text-lg">
            <p>
              누군가의 커리어를 바꾸는 결정적인 순간, 그 중심에는 늘 정보의 불균형이 있습니다.
            </p>
            <p>
              채용 시장은 구직자와 기업 모두에게 이미 충분히 불투명합니다. 어떤 기업이 실제로 좋은 곳인지, 면접 뒤에 어떤 일이 벌어지는지, 제시된 조건이 진짜인지. 수많은 플랫폼과 리뷰 서비스가 생겨났지만, 그 안에서도 여전히 가장 정보가 닫혀 있는 영역이 있습니다. 바로 헤드헌팅입니다.
            </p>
            <p>
              어떤 서치펌이 어떤 포지션을 진짜로 다루는지, 어떤 헤드헌터가 신뢰할 수 있는지, 실제로 함께 일해본 사람들의 솔직한 이야기는 어디에도 존재하지 않습니다. 구직자는 처음 연락을 받는 순간부터 모든 것을 헤드헌터의 말에만 의존해야 하고, HR 담당자는 서치펌을 선정할 때 지인의 소개나 막연한 브랜드 인지도에 기댈 수밖에 없습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 섹션 2 - 전문 영역의 균열 */}
      <section className="py-16 md:py-24 bg-[var(--muted-bg)]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-8 leading-snug">
            전문 영역의 균열
          </h2>
          <div className="space-y-6 text-[var(--muted)] leading-relaxed text-base md:text-lg mb-12">
            <p>
              헤드헌팅은 본래 시장에서 쉽게 찾기 어려운 핵심 인재, 경쟁사의 탁월한 리더, 희소한 전문가를 발굴하는 고도의 전문 영역이었습니다. 단순히 이력서를 전달하는 것이 아니라, 기업의 전략적 방향을 이해하고 인재의 커리어 궤적을 함께 설계하는 일이었습니다. 기업과 인재 양쪽 모두에게 진정한 가치를 만들어내는 파트너십이었습니다.
            </p>
            <p>
              그러나 이직 시장의 급격한 성장과 채용 수요의 폭발적 증가는 이 전문 영역의 진입 장벽을 사실상 허물었습니다. 자격 요건도, 검증 절차도 사라진 자리에 수많은 헤드헌터가 생겨났고, 시장은 빠르게 포화되었습니다.
            </p>
          </div>

          {/* 문제 사례 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {PROBLEM_CARDS.map((card, i) => (
              <div
                key={i}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 flex items-start gap-4"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{card.icon}</span>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>

          <p className="text-[var(--muted)] leading-relaxed text-base md:text-lg italic border-l-4 border-primary-500/50 pl-6">
            정보가 없으니 구별할 수가 없고, 구별할 수 없으니 모두가 같은 시선으로 보게 됩니다. 이것이 지금 헤드헌팅 시장이 처한 현실입니다.
          </p>
        </div>
      </section>

      {/* 섹션 3 - H.Lens의 목표 */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-8 leading-snug">
            H.Lens가 만들고자 하는 것
          </h2>
          <div className="space-y-6 text-[var(--muted)] leading-relaxed text-base md:text-lg mb-12">
            <p>
              H.Lens는 헤드헌팅 시장을 투명하게 들여다볼 수 있는 렌즈가 되고자 합니다.
            </p>
            <p>
              실제 경험을 바탕으로 한 검증된 리뷰로 신뢰할 수 있는 헤드헌터를 찾을 수 있게 하고, 좋은 헤드헌터가 자신의 전문성으로 정당한 평가를 받을 수 있는 환경을 만들고자 합니다. 투명한 정보는 시장을 건강하게 만듭니다. 좋은 헤드헌터가 드러나면, 그렇지 않은 헤드헌터는 자연스럽게 걸러집니다. 이것이 H.Lens가 믿는 방식입니다.
            </p>
          </div>

          {/* 가치 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {VALUE_CARDS.map((card, i) => (
              <div
                key={i}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-500 mx-auto mb-4">
                  {card.icon}
                </div>
                <h3 className="text-sm font-semibold text-primary-500 mb-2">{card.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-lg md:text-xl font-semibold text-[var(--foreground)] leading-relaxed">
            헤드헌팅 본연의 가치를 되찾는 일,{" "}
            <span className="text-primary-500">H.Lens</span>가 함께 하겠습니다.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="hero-gradient rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                지금 바로 헤드헌터를 검증하세요
              </h2>
              <p className="text-blue-200/80 mb-8 max-w-lg mx-auto">
                실제 경험자들의 리뷰로 신뢰할 수 있는 헤드헌터를 찾아보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/headhunters"
                  className="inline-flex items-center justify-center gap-2 bg-white text-navy-800 px-8 py-3.5 rounded-xl font-semibold transition hover:bg-gray-100"
                >
                  헤드헌터 찾기
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Link>
                <Link
                  href="/reviews/new"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition"
                >
                  리뷰 작성하기
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
