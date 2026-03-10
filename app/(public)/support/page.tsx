"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "리뷰를 삭제하고 싶어요. 어떻게 하나요?",
    a: "본인이 작성한 리뷰의 삭제를 원하시면 고객센터 문의 폼을 통해 삭제 요청을 접수해주세요. 리뷰 ID와 삭제 사유를 함께 기재해주시면 검토 후 처리해드립니다. 처리 기간은 영업일 기준 1~3일 소요됩니다.",
  },
  {
    q: "헤드헌터로 등록하려면 어떻게 하나요?",
    a: "먼저 H.Lens에 회원가입한 후, 사용자 유형으로 '헤드헌터'를 선택해주세요. 서치펌 이메일 인증과 재직증명서 또는 명함을 제출하시면 관리자 검토 후 1~2 영업일 내 승인이 완료됩니다.",
  },
  {
    q: "HR 담당자 인증은 어떻게 진행되나요?",
    a: "회원가입 시 'HR 담당자'를 선택하시면 추가 인증 페이지로 이동합니다. 회사 이메일(일반 포털 이메일 제외)과 명함을 제출해주세요. 명함은 인증 용도로만 사용되며 공개되지 않습니다.",
  },
  {
    q: "리뷰에 증빙 자료를 제출하면 어떤 이점이 있나요?",
    a: "증빙 자료(이메일 캡처, 명함 사진 등)를 제출한 리뷰는 '인증 리뷰'로 표시되며, 헤드헌터 프로필의 신뢰도 산정에 더 큰 가중치를 부여받습니다. 증빙 자료는 다른 사용자에게 공개되지 않습니다.",
  },
  {
    q: "헤드헌터 프로필을 클레임(소유권 주장)하려면 어떻게 하나요?",
    a: "서비스에 이미 등록된 본인의 프로필을 관리하고 싶다면, 헤드헌터로 가입 후 마이페이지에서 클레임 요청을 할 수 있습니다. 서치펌 이메일 인증 후 관리자가 승인하면 프로필 관리 및 리뷰 답변 기능이 활성화됩니다.",
  },
  {
    q: "허위 리뷰를 발견했어요. 어떻게 신고하나요?",
    a: "허위 리뷰가 의심되는 경우 아래 문의 폼을 통해 신고해주세요. 문의 유형을 '리뷰 신고'로 선택하고, 해당 리뷰의 URL 또는 헤드헌터명과 구체적인 신고 사유를 기재해주시면 검토 후 조치합니다.",
  },
  {
    q: "회원 탈퇴는 어떻게 하나요?",
    a: "마이페이지에서 회원 탈퇴를 요청하실 수 있습니다. 탈퇴 시 개인정보는 30일 이내 파기되며, 작성하신 리뷰는 익명화되어 유지됩니다. 리뷰 삭제를 원하시면 탈퇴 전에 별도 요청해주세요.",
  },
  {
    q: "비밀번호를 잊어버렸어요.",
    a: "이메일/비밀번호로 가입하신 경우, 로그인 페이지에서 '비밀번호 찾기'를 통해 재설정할 수 있습니다. 구글 또는 카카오 계정으로 가입하신 경우에는 해당 소셜 서비스에서 비밀번호를 관리해주세요.",
  },
  {
    q: "서치펌 정보가 잘못되어 있어요. 수정 요청은 어떻게 하나요?",
    a: "서치펌 정보의 오류를 발견하셨다면 문의 폼을 통해 '기타 문의'로 접수해주세요. 서치펌명, 수정이 필요한 항목, 올바른 정보를 기재해주시면 확인 후 반영합니다.",
  },
  {
    q: "리뷰 작성 시 이름이 공개되나요?",
    a: "아닙니다. H.Lens의 모든 리뷰는 익명으로 게시됩니다. 리뷰 작성자의 이름, 이메일 등 개인정보는 헤드헌터를 포함한 누구에게도 공개되지 않습니다. 다만 회원 유형(구직자/HR 담당자)은 리뷰 유형으로 표시될 수 있습니다.",
  },
];

const INQUIRY_TYPES = [
  "리뷰 삭제 요청",
  "리뷰 신고",
  "헤드헌터 등록/인증",
  "계정 관련",
  "서치펌 정보 수정",
  "제휴 문의",
  "기타 문의",
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    content: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">고객센터</h1>
      <p className="text-[var(--muted)] mb-10">
        궁금하신 점이 있으시면 아래 자주 묻는 질문을 확인하시거나, 문의 폼을 통해 연락해주세요.
      </p>

      {/* 이메일 안내 */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">이메일 문의</p>
          <p className="text-sm text-[var(--muted)]">
            support@hlens.app | 영업일 기준 1~2일 이내 답변
          </p>
        </div>
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">자주 묻는 질문</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border border-[var(--card-border)] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--muted-bg)] transition"
              >
                <span className="text-sm font-medium text-[var(--foreground)] pr-4">{item.q}</span>
                <svg
                  className={`w-4 h-4 text-[var(--muted)] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 문의 폼 */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">문의하기</h2>

        {submitted ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-8 text-center">
            <div className="w-14 h-14 mx-auto bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">문의가 접수되었습니다</h3>
            <p className="text-sm text-[var(--muted)]">
              영업일 기준 1~2일 이내에 입력하신 이메일로 답변을 드리겠습니다.
            </p>
            <button
              onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", type: "", content: "" }); }}
              className="mt-4 text-sm text-primary-600 hover:underline"
            >
              추가 문의하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">이름</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">이메일</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="답변 받을 이메일"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">문의 유형</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">문의 유형을 선택하세요</option>
                {INQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">문의 내용</label>
              <textarea
                required
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="문의 내용을 자세히 작성해주세요"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition"
            >
              문의 접수
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
