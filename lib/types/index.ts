// ===== 사용자 타입 =====
export type UserType = 'job_seeker' | 'hr_manager' | 'headhunter';

// ===== 사용자 상태 =====
export type UserStatus = 'pending' | 'active' | 'suspended';

// ===== 리뷰 타입 =====
export type ReviewType = 'verified' | 'general';

// ===== 신뢰 배지 =====
export type TrustBadgeLevel = 'none' | 'partial' | 'full';

// ===== 인증 등급 =====
export type VerificationLevel = 'none' | 'claimed' | 'verified';

// ===== 기업 구분 =====
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'foreign';

// ===== 서치펌 상태 =====
export type FirmStatus = 'active' | 'inactive';

// ===== 평가 항목 =====
export interface Ratings {
  professionalism: number;  // 전문성
  communication: number;    // 소통 및 대응
  reliability: number;      // 신뢰성 및 윤리
  support: number;          // 지원 및 코칭
  transparency: number;     // 투명성
}

// ===== 사용자 프로필 =====
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  user_type: UserType;
  status: UserStatus;
  company_email: string | null;
  company_email_verified: boolean;
  business_card_url: string | null;
  agreed_terms_at: string | null;
  provider: string | null;
  avatar_url: string | null;
  created_at: string;
}

// ===== 서치펌 =====
export interface SearchFirm {
  id: string;
  name: string;
  website: string | null;
  description: string | null;
  specialty_fields: string[];
  email_domain: string | null;
  status: FirmStatus;
  created_at: string;
}

// ===== 헤드헌터 =====
export interface Headhunter {
  id: string;
  name: string;
  search_firm_id: string | null;
  firm_name: string;
  specialty_fields: string[];
  total_rating: number;
  review_count: number;
  verified_review_count: number;
  trust_badge_level: TrustBadgeLevel;
  linkedin_url: string | null;
  profile_image: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  claimed_by: string | null;
  is_claimed: boolean;
  verification_level: VerificationLevel;
  created_at: string;
  // 조인 데이터
  search_firm?: SearchFirm;
}

// ===== 리뷰 =====
export interface Review {
  id: string;
  headhunter_id: string;
  reviewer_id: string;
  reviewer_type: UserType;
  review_type: ReviewType;
  contact_date: string;
  job_field: string;
  contact_channel: string;
  company_size: CompanySize | null;
  career_level: string;
  ratings: Ratings;
  keywords_positive: string[];
  keywords_negative: string[];
  content: string;
  nps_score: number; // 0-10
  headhunter_reply: string | null;
  created_at: string;
}

// ===== 헤드헌터 포지션 =====
export interface HeadhunterPosition {
  id: string;
  headhunter_id: string;
  title: string;
  industry: string;
  company_size: CompanySize;
  career_min: number;
  career_max: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

// ===== 헤드헌터 컨택 (관심 있어요) =====
export interface HeadhunterContact {
  id: string;
  headhunter_id: string;
  user_id: string;
  position_id: string | null;
  created_at: string;
  // 조인 데이터
  user?: {
    nickname: string;
    user_type: UserType;
  };
  position?: HeadhunterPosition;
}

// ===== 커뮤니티 게시글 =====
export interface CommunityPost {
  id: string;
  community_type: UserType;
  category: string;
  title: string;
  content: string;
  author_id: string;
  nickname: string;
  job_function: string | null;
  career_level: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ===== 커뮤니티 댓글 =====
export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string;
  nickname: string;
  content: string;
  like_count: number;
  is_deleted: boolean;
  created_at: string;
}

// ===== 아티클 대상 유형 =====
export type ArticleTargetType = 'job_seeker' | 'hr_manager' | 'headhunter' | 'all';

// ===== 아티클 =====
export interface Article {
  id: string;
  title: string;
  content: string; // markdown
  summary: string;
  target_type: ArticleTargetType;
  category: string;
  author: string;
  thumbnail_url: string | null;
  published_at: string;
  created_at: string;
}

// ===== 차단할 일반 이메일 도메인 =====
export const BLOCKED_EMAIL_DOMAINS = [
  'gmail.com', 'naver.com', 'daum.net', 'hanmail.net',
  'kakao.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'nate.com', 'icloud.com', 'me.com', 'live.com',
  'msn.com', 'aol.com', 'protonmail.com',
];

// ===== 이메일 도메인 유효성 검사 =====
export function isCompanyEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !BLOCKED_EMAIL_DOMAINS.includes(domain);
}
