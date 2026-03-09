// ===== 리뷰 작성 폼 상수 =====

export const STEPS = [
  { label: "헤드헌터 정보", short: "헤드헌터" },
  { label: "기본 정보", short: "기본정보" },
  { label: "평점 입력", short: "평점" },
  { label: "키워드 & 리뷰", short: "키워드" },
  { label: "종합 & 제출", short: "제출" },
];

export const CONTACT_CHANNELS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "이메일" },
  { value: "phone", label: "전화" },
  { value: "jobsite", label: "사람인/잡코리아" },
  { value: "referral", label: "지인 소개" },
  { value: "other", label: "기타" },
];

export const INDUSTRIES = [
  "IT/소프트웨어",
  "금융/보험",
  "제조/생산",
  "바이오/헬스케어",
  "유통/소비재",
  "컨설팅",
  "기타",
];

export const JOB_FUNCTIONS = [
  "개발/엔지니어링",
  "기획/PM",
  "마케팅",
  "영업",
  "재무/회계",
  "HR/인사",
  "기타",
];

export const SENIORITY_LEVELS = [
  { value: "junior", label: "신입~3년" },
  { value: "mid", label: "3~7년" },
  { value: "senior", label: "7~10년" },
  { value: "lead", label: "10년 이상" },
  { value: "executive", label: "임원급" },
];

export const PROGRESS_RESULTS = [
  { value: "in_progress", label: "진행 중" },
  { value: "accepted", label: "최종 합격" },
  { value: "rejected", label: "최종 불합격" },
  { value: "withdrawn", label: "중도 포기" },
];

// ===== 평점 가이드 문구 =====
export const RATING_GUIDES = {
  job_seeker: {
    professionalism: "담당 직무와 산업에 대한 이해도가 높았나요? 내 경력을 정확하게 파악했나요?",
    communication: "연락이 빠르고 질문에 충실하게 답했나요? 의사소통이 명확했나요?",
    reliability: "제공한 정보가 정확했나요? 약속을 잘 지켰나요?",
    support: "이력서·면접·연봉협상 등 실질적인 도움을 받았나요?",
    transparency: "회사와 포지션 정보를 솔직하게 공유했나요?",
  },
  hr_manager: {
    professionalism: "우리 포지션 요건을 정확히 이해했나요? 산업과 직무에 대한 이해도가 높았나요?",
    communication: "보고와 커뮤니케이션이 빠르고 정확했나요?",
    reliability: "후보자 정보가 정확했나요? 약속한 일정을 지켰나요?",
    support: "추천 후보자의 퀄리티가 높았나요? 채용 과정에서 적극적으로 지원했나요?",
    transparency: "진행 상황을 투명하게 공유했나요?",
  },
};

export const RATING_LABELS = {
  professionalism: "전문성",
  communication: "소통 및 대응",
  reliability: "신뢰성 및 윤리",
  support: "지원 및 코칭",
  transparency: "투명성",
};

export const HR_EXTRA_RATING_LABELS = {
  feeAdequacy: "수수료율 적정성",
  guaranteeSatisfaction: "보증기간 조건 만족도",
  contractTerms: "계약 조건 전반 평가",
};

// ===== 키워드 =====
export const POSITIVE_KEYWORDS = [
  "전문적", "빠른 응답", "꼼꼼함", "투명함", "친절함", "적극적",
  "맞춤 추천", "시장 분석력", "협상 능력", "지속적 관리",
  "솔직함", "업계 이해도 높음", "면접 코칭 우수", "신뢰할 수 있음",
];

export const NEGATIVE_KEYWORDS = [
  "연락 두절", "정보 부정확", "일방적 소통", "무성의한 답변",
  "과장된 설명", "약속 불이행", "후속 관리 없음", "압박적",
  "포지션 미스매치", "개인정보 유출 우려",
];
