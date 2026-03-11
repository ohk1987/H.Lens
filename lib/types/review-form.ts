import type { Ratings, UserType } from "./index";

export interface HrExtraRatings {
  feeAdequacy: number;
  guaranteeSatisfaction: number;
  contractTerms: number;
}

export interface ReviewFormData {
  // Step 1: 헤드헌터 정보
  headhunterId: string | null;
  headhunterName: string;
  headhunterEmail: string;
  headhunterPhone: string;
  searchFirmId: string;
  searchFirmCustom: string;
  matchedHeadhunter: {
    id: string;
    name: string;
    firm_name: string;
  } | null;

  // Step 2: 기본 정보
  contactDate: string;
  contactChannel: string;
  contactChannelDetail: string;
  contactChannelCustom: string;
  companyName: string;
  companySize: string;
  industry: string;
  jobFunction: string;
  seniority: string;
  progressResult: string;

  // Step 3: 평점
  ratings: Ratings;
  hrExtraRatings: HrExtraRatings;

  // Step 4: 키워드 & 리뷰
  keywordsPositive: string[];
  keywordsNegative: string[];
  customPositiveKeyword: string;
  customNegativeKeyword: string;
  content: string;

  // Step 5: 종합 & 제출
  overallRating: number;
  wouldRecommend: boolean | null;
  evidenceFile: File | null;
}

export const INITIAL_FORM_DATA: ReviewFormData = {
  headhunterId: null,
  headhunterName: "",
  headhunterEmail: "",
  headhunterPhone: "",
  searchFirmId: "",
  searchFirmCustom: "",
  matchedHeadhunter: null,

  contactDate: "",
  contactChannel: "",
  contactChannelDetail: "",
  contactChannelCustom: "",
  companyName: "",
  companySize: "",
  industry: "",
  jobFunction: "",
  seniority: "",
  progressResult: "",

  ratings: {
    professionalism: 0,
    communication: 0,
    reliability: 0,
    support: 0,
    transparency: 0,
  },
  hrExtraRatings: {
    feeAdequacy: 0,
    guaranteeSatisfaction: 0,
    contractTerms: 0,
  },

  keywordsPositive: [],
  keywordsNegative: [],
  customPositiveKeyword: "",
  customNegativeKeyword: "",
  content: "",

  overallRating: 0,
  wouldRecommend: null,
  evidenceFile: null,
};

export type ReviewerRole = Extract<UserType, "job_seeker" | "hr_manager">;
