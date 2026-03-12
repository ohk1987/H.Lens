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
  { value: "job_site", label: "채용플랫폼" },
  { value: "referral", label: "지인 소개" },
  { value: "other", label: "기타" },
];

export const JOBSITE_SUB_OPTIONS = [
  { value: "saramin", label: "사람인" },
  { value: "jobkorea", label: "잡코리아" },
  { value: "remember", label: "리멤버" },
  { value: "jobsite_other", label: "기타(직접입력)" },
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

export const COMPANY_SIZES = [
  { value: "startup", label: "스타트업" },
  { value: "small", label: "중소기업" },
  { value: "medium", label: "중견기업" },
  { value: "large", label: "대기업" },
  { value: "foreign", label: "외국계" },
];

export const COMPANY_SIZE_LABELS: Record<string, string> = {
  startup: "스타트업",
  small: "중소기업",
  medium: "중견기업",
  large: "대기업",
  foreign: "외국계",
};

export const PROGRESS_RESULTS = [
  { value: "in_progress", label: "진행 중" },
  { value: "hired", label: "최종 합격" },
  { value: "rejected", label: "최종 불합격" },
  { value: "dropped", label: "중도 포기" },
  { value: "no_feedback", label: "안내받지 못함" },
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

// ===== 평점 항목별 점수 가이드 =====
export const SCORE_GUIDES: Record<string, Record<number, string>> = {
  professionalism: {
    1: "직무/산업 이해도가 매우 낮고 경력 파악이 부정확함",
    2: "기본적인 이해는 있으나 전문성이 부족함",
    3: "평균적인 수준의 전문성을 보여줌",
    4: "직무와 산업에 대한 이해도가 높고 경력을 정확히 파악함",
    5: "탁월한 전문성으로 깊은 인사이트를 제공함",
  },
  communication: {
    1: "연락이 거의 없고 질문에 답변하지 않음",
    2: "응답이 느리고 소통이 불명확함",
    3: "기본적인 소통은 가능하나 개선이 필요함",
    4: "빠르고 명확한 소통으로 신뢰감을 줌",
    5: "매우 신속하고 충실한 소통으로 최상의 경험을 제공함",
  },
  reliability: {
    1: "정보가 부정확하고 약속을 지키지 않음",
    2: "간혹 정보 오류가 있고 약속 이행이 미흡함",
    3: "대체로 신뢰할 수 있으나 일부 아쉬움이 있음",
    4: "정확한 정보 제공과 약속 이행으로 신뢰감이 높음",
    5: "완벽한 신뢰성과 높은 윤리 의식을 보여줌",
  },
  support: {
    1: "이력서/면접/연봉협상에 도움을 주지 않음",
    2: "기본적인 안내만 제공하고 실질적 도움이 부족함",
    3: "평균적인 수준의 지원을 제공함",
    4: "적극적인 코칭으로 취업 준비에 실질적 도움을 줌",
    5: "탁월한 코칭과 지원으로 최상의 결과를 이끌어냄",
  },
  transparency: {
    1: "회사/포지션 정보를 거의 공개하지 않음",
    2: "일부 정보만 제공하고 진행 상황 공유가 부족함",
    3: "기본적인 정보는 제공하나 투명성이 아쉬움",
    4: "충분한 정보와 진행 상황을 투명하게 공유함",
    5: "모든 정보를 완전히 공개하고 높은 투명성을 보여줌",
  },
  overall: {
    1: "매우 실망스러운 경험이었습니다",
    2: "기대에 미치지 못했습니다",
    3: "보통 수준의 경험이었습니다",
    4: "만족스러운 경험이었습니다",
    5: "강력히 추천하고 싶은 훌륭한 헤드헌터입니다",
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
