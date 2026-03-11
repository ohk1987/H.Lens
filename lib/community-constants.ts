export type CommunityType = "job_seeker" | "hr_manager" | "headhunter";

export const COMMUNITY_INFO: Record<CommunityType, { name: string; desc: string; icon: string }> = {
  job_seeker: {
    name: "이직 라운지",
    desc: "이직 경험, 연봉 정보, 면접 후기를 공유하세요.",
    icon: "briefcase",
  },
  hr_manager: {
    name: "채용 인사이트",
    desc: "채용 전략, 헤드헌터 활용법, 업계 정보를 나눠보세요.",
    icon: "building",
  },
  headhunter: {
    name: "서치펌 라운지",
    desc: "헤드헌팅 노하우, 업계 소식, 고충을 나눠보세요.",
    icon: "star",
  },
};

export const COMMUNITY_CATEGORIES: Record<CommunityType, { value: string; label: string }[]> = {
  job_seeker: [
    { value: "transfer_review", label: "이직후기" },
    { value: "salary_info", label: "연봉정보" },
    { value: "interview_review", label: "면접후기" },
    { value: "headhunter_exp", label: "헤드헌터경험" },
    { value: "career_concern", label: "이직고민" },
    { value: "free", label: "자유" },
  ],
  hr_manager: [
    { value: "hiring_strategy", label: "채용전략" },
    { value: "headhunter_usage", label: "헤드헌터활용" },
    { value: "industry_info", label: "업계정보" },
    { value: "policy", label: "제도정책" },
    { value: "free", label: "자유" },
  ],
  headhunter: [
    { value: "industry_info", label: "업계정보" },
    { value: "knowhow", label: "노하우공유" },
    { value: "difficulties", label: "고충나눔" },
    { value: "collaboration", label: "협업" },
    { value: "free", label: "자유" },
  ],
};

export const COMMUNITY_TYPE_LABELS: Record<CommunityType, string> = {
  job_seeker: "이직 라운지",
  hr_manager: "채용 인사이트",
  headhunter: "서치펌 라운지",
};

export const COMMUNITY_ACCESS: Record<CommunityType, string> = {
  job_seeker: "job_seeker",
  hr_manager: "hr_manager",
  headhunter: "headhunter",
};
