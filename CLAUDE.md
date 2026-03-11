# H.Lens - 헤드헌터 리뷰 플랫폼

## 1. 프로젝트 개요

- **서비스명**: H.Lens (에이치렌즈)
- **목적**: 한국 채용시장의 헤드헌터(서치펌 컨설턴트) 리뷰 플랫폼
- **타겟 사용자**: 구직자(job_seeker), HR담당자(hr_manager), 헤드헌터(headhunter)
- **배포 URL**: https://hlens.vercel.app
- **언어**: 한국어 전용 서비스 (UI 텍스트 모두 한국어)

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Runtime | React 18 |
| DB | Supabase (PostgreSQL) |
| 인증 | next-auth v4 (JWT strategy) |
| OAuth | Google, Kakao |
| CSS | Tailwind CSS 3.4 + CSS Variables (다크모드 지원) |
| 차트 | Recharts 3.8 |
| 마크다운 | react-markdown 10 |
| 비밀번호 | bcryptjs |
| 배포 | Vercel |

## 3. 프로젝트 구조

```
app/
├── layout.tsx                          # 루트 레이아웃 (Header, Footer, AuthProvider, AchievementToast)
├── (auth)/                             # 인증 관련 페이지
│   ├── login/                          # 로그인 (Google/Kakao/Email)
│   ├── signup/                         # 이메일 회원가입
│   ├── onboarding/                     # 사용자 유형 선택 + 닉네임 설정 (2단계)
│   │   ├── hh-verify/                  # 헤드헌터 인증 서류 제출
│   │   └── hr-verify/                  # HR 인증 서류 제출
│   └── welcome/                        # 환영 페이지
├── (public)/                           # 공개 페이지
│   ├── page.tsx                        # 홈 (히어로, 검색바, 인기 헤드헌터, 최근 리뷰)
│   ├── headhunters/                    # 헤드헌터 목록 + [id] 프로필 상세
│   ├── firms/                          # 서치펌 목록 + [id] 상세
│   ├── articles/                       # 아티클 목록 + [id] 상세
│   ├── community/                      # 커뮤니티 (현재 "준비 중")
│   │   ├── page.tsx                    # 준비 중 페이지 + 이메일 대기자 등록
│   │   └── [type]/                     # 타입별 게시판 (구현 완료, COMMUNITY_OPEN=false로 비활성)
│   │       ├── [id]/                   # 게시글 상세
│   │       └── write/                  # 글 작성
│   ├── reviews/new/                    # 리뷰 작성 폼 (5단계 위자드)
│   ├── partnership/                    # 제휴 문의
│   ├── support/                        # 고객지원
│   ├── headhunter-register/            # 헤드헌터 등록 안내
│   ├── review-guidelines/              # 리뷰 가이드라인
│   ├── terms/                          # 이용약관
│   └── privacy/                        # 개인정보처리방침
├── (dashboard)/                        # 로그인 필수 페이지
│   ├── my/                             # 마이페이지 (프로필, 대표배지, 업적, 내 리뷰)
│   └── dashboard/headhunter/           # 헤드헌터 전용 대시보드
│       ├── page.tsx                    # 대시보드 (통계, 리뷰 답글, 포지션 관리)
│       └── edit/                       # 프로필 수정 (bio, 전문분야)
└── api/                                # API 라우트
    ├── auth/                           # NextAuth, 회원가입, 온보딩, 닉네임체크, 인증
    ├── headhunters/                    # 헤드헌터 CRUD, 검색, 클레임
    ├── reviews/                        # 리뷰 작성, 최근 리뷰
    ├── firms/                          # 서치펌 목록
    ├── search-firms/                   # 서치펌 검색 (리뷰 폼용)
    ├── articles/                       # 아티클 목록
    ├── dashboard/headhunter/           # 헤드헌터 대시보드 API
    ├── community/                      # 커뮤니티 API (게시글, 댓글, 좋아요, 대기자)
    ├── achievements/                   # 업적 조회/대표배지 토글
    ├── notifications/                  # 알림 조회/읽음처리
    ├── stats/                          # 홈페이지 통계
    └── upload/verification-doc/        # 인증서류 업로드

components/
├── layout/          # Header (네비게이션 분기), Footer
├── home/            # HeroSection, SearchBar, PopularHeadhunters, LatestReviews, UserTypeTabs, CtaSection
├── headhunter/      # HeadhunterCard, HeadhunterProfile, ReviewCard, ReviewList, TrendChart, RadarChart
├── review/          # ReviewForm (5단계), StarRating, KeywordSelector, steps/*
├── firm/            # FirmCard
├── article/         # ArticleCard
├── my/              # AchievementsSection
├── providers/       # AuthProvider (SessionProvider)
└── ui/              # ThemeToggle, CountUp, ScrollSection, AchievementToast

lib/
├── auth/            # options.ts (NextAuth 설정), types.ts (세션 타입 확장)
├── supabase/        # server.ts (createAdminClient, createClient), client.ts, middleware.ts
├── achievements/    # checker.ts (checkAchievements, updateLoginStreak)
├── headhunter/      # claim.ts (클레임 로직)
├── hooks/           # useScrollAnimation
├── types/           # index.ts (전체 타입), review-form.ts (리뷰 폼 타입)
├── constants.ts     # USER_TYPE_LABELS, USER_STATUS_LABELS
├── review-constants.ts   # 리뷰 폼 상수 (산업, 직군, 평점 가이드 등)
├── community-constants.ts # 커뮤니티 카테고리, 접근 권한
├── mock-data.ts     # 개발용 목 데이터 (헤드헌터, 리뷰, 서치펌)
└── mock-articles.ts # 개발용 아티클 목 데이터
```

## 4. 사용자 유형 및 권한

### 사용자 유형 (`user_type` ENUM)
| 코드 | 한국어 | 설명 |
|------|--------|------|
| `job_seeker` | 구직자 | 리뷰 작성, 커뮤니티 참여 |
| `hr_manager` | HR 담당자 | 리뷰 작성 (HR 추가 평점), 커뮤니티 참여 |
| `headhunter` | 헤드헌터 | 리뷰 작성 불가, 대시보드/프로필 관리, 리뷰 답글 |

### 인증 상태 (`status`)
| 코드 | 한국어 | 의미 |
|------|--------|------|
| `active` | 활성 | 모든 기능 사용 가능 |
| `pending` | 인증 대기중 | 서류 제출 후 승인 대기 |
| `suspended` | 정지 | 관리자에 의한 정지 |
| `rejected` | 인증 거절 | 서류 검토 후 거절 (DB ENUM에는 없음, 앱에서만 사용) |

### 기능별 접근 권한
| 기능 | 비로그인 | 구직자 | HR | 헤드헌터 |
|------|----------|--------|-----|---------|
| 헤드헌터/서치펌 조회 | O | O | O | O |
| 아티클 조회 | O | O | O | O |
| 리뷰 작성 | X | O | O (추가 평점) | X |
| 커뮤니티 | X | 이직라운지 | 채용인사이트 | 서치펌라운지 |
| 마이페이지 | X | O | O | O |
| 헤드헌터 대시보드 | X | X | X | O |
| 리뷰 답글 | X | X | X | O (자기 프로필) |
| 포지션 등록 | X | X | X | O (최대 5개) |

### 네비게이션 분기
- **헤드헌터**: 찾기(▾ 헤드헌터 찾기, 서치펌 찾기) | 아티클 | 내 대시보드 | 커뮤니티 | 마이페이지
- **기타**: 찾기(▾ 헤드헌터 찾기, 서치펌 찾기) | 아티클 | 리뷰 작성 | 커뮤니티 | 마이페이지

## 5. DB 스키마 요약

### 핵심 테이블
```
users                  -- 사용자 (email, name, nickname, user_type, status, password_hash,
                          company_email, last_login_at, login_streak, total_login_days)

headhunters            -- 헤드헌터 프로필 (name, email, phone, search_firm_id, claimed_by,
                          is_claimed, bio, profile_image, verification_level)

search_firms           -- 서치펌 (name, website, description, specialty_fields[], status)

reviews                -- 리뷰 (headhunter_id, reviewer_id, reviewer_type, review_type,
                          6개 공통 평점, 3개 HR 평점, keywords, content, recommend,
                          headhunter_reply, evidence_file_url, verification_status)

headhunter_positions   -- 포지션 공고 (headhunter_id, title, industry, company_size,
                          career_min/max, description, is_active, interest_count)

headhunter_contacts    -- 관심/문의 (headhunter_id, user_id, position_id)

claim_requests         -- 프로필 클레임 요청 (headhunter_id, user_id, status, evidence_url)
```

### 커뮤니티 테이블 (COMMUNITY_OPEN=false로 비활성)
```
community_posts        -- 게시글 (community_type, category, title, content, author_id)
community_comments     -- 댓글 (post_id, author_id, content)
community_likes        -- 좋아요 (target_type, target_id, user_id)
community_waitlist     -- 이메일 대기자 (email)
```

### 업적 테이블
```
achievements           -- 업적 정의 (code, name, grade, condition_type, condition_value) - 30개 시드
user_achievements      -- 사용자 업적 달성 기록 (is_displayed: 대표배지 최대 3개)
achievement_progress   -- 진행도 추적 (current_value)
notifications          -- 알림 (type, title, message, data, is_read)
```

### 기타
```
articles               -- 아티클 (title, content, summary, target_type, category)
```

### 주요 ENUM 값
```sql
user_type:           'job_seeker', 'hr_manager', 'headhunter'
user_status:         'pending', 'active', 'suspended'
review_kind:         'general', 'verified'
verification_status: 'none', 'pending', 'verified'
contact_channel:     'linkedin', 'email', 'phone', 'job_site', 'referral', 'other'
progress_result:     'in_progress', 'hired', 'rejected', 'dropped'
company_size:        'startup', 'small', 'medium', 'large', 'foreign'
community_type:      'job_seeker', 'hr_manager', 'headhunter'
```

## 6. 핵심 기능 목록

### 완성된 기능
- [x] OAuth 로그인 (Google, Kakao) + 이메일 회원가입
- [x] 2단계 온보딩 (사용자 유형 선택 → 닉네임 설정)
- [x] HR/헤드헌터 인증 서류 제출
- [x] 헤드헌터 목록/검색/필터/정렬
- [x] 헤드헌터 프로필 상세 (평점, 리뷰, 트렌드 차트)
- [x] 5단계 리뷰 작성 위자드 (구직자/HR 분기)
- [x] 서치펌 목록/상세
- [x] 아티클 목록/상세 (마크다운 렌더링)
- [x] 헤드헌터 프로필 클레임 시스템
- [x] 헤드헌터 전용 대시보드 (통계, 리뷰 답글, 포지션 CRUD)
- [x] 헤드헌터 프로필 수정 (bio, 전문분야)
- [x] 커뮤니티 (DB/API/UI 완성, COMMUNITY_OPEN=false로 비활성)
- [x] 업적 시스템 (30개 업적, 진행도, 대표배지, 토스트 알림)
- [x] 마이페이지 (프로필, 업적, 내 리뷰)
- [x] 다크모드 (CSS Variables + class 기반)
- [x] 반응형 디자인

### 비활성 기능
- [ ] 커뮤니티 오픈 (`COMMUNITY_OPEN = false` → `true`로 변경 시 활성화)
- [ ] 미들웨어 인증 (QA MODE로 비활성, 배포 전 복구 필요)

## 7. 개발 규칙 및 컨벤션

### Supabase 접근
```typescript
// 항상 createAdminClient() 사용 (RLS 우회, service_role key)
import { createAdminClient } from "@/lib/supabase/server";
const supabase = createAdminClient();

// 클라이언트 사이드에서는 API 라우트를 통해서만 접근
// 절대 클라이언트에서 직접 supabase 쿼리 금지
```

### 인증 패턴
```typescript
// API 라우트에서 세션 확인
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
}
// session.user.id, session.user.userType, session.user.status, session.user.provider
```

### Mock 데이터 Fallback 패턴
```typescript
// 여러 페이지에서 사용하는 패턴: API 호출 → 실패 시 mock 데이터
try {
  const res = await fetch("/api/...");
  if (res.ok) data = await res.json();
} catch {
  data = MOCK_DATA; // lib/mock-data.ts
}
```

### 환경변수
| 변수 | 용도 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | O |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 | O |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 키 (RLS 우회) | O |
| `NEXTAUTH_URL` | 앱 URL (로컬: http://localhost:3000) | O |
| `NEXTAUTH_SECRET` | JWT 서명 시크릿 | O |
| `GOOGLE_CLIENT_ID` | Google OAuth | O |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | O |
| `KAKAO_CLIENT_ID` | Kakao OAuth | O |
| `KAKAO_CLIENT_SECRET` | Kakao OAuth | 선택 |

### 컴포넌트 컨벤션
- 서버 컴포넌트 기본, 상호작용 필요 시 클라이언트 컴포넌트 (`"use client"`)
- CSS: Tailwind 유틸리티 + CSS 변수 (`var(--foreground)`, `var(--card-bg)` 등)
- 색상: `primary-*` (파란색 계열), `navy-*` (짙은 남색 계열) 커스텀 팔레트
- 카드 패턴: `bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6`
- 에러 메시지: 한국어로 작성

### 코드 스타일
- 함수형 컴포넌트 + Hooks
- Named export 기본 (`export default function`)
- API 응답: `NextResponse.json({ ... })`
- DB 에러 시 `console.error()` + 사용자 친화적 한국어 에러 반환
- 비동기 업적 체크: `.catch(() => {})` 패턴 (실패해도 메인 응답에 영향 없음)

## 8. 현재 미완성 / TODO 항목

### 크리티컬 (배포 전 필수)
- **`middleware.ts` QA MODE**: 전체 인증/권한 로직이 주석처리됨. 배포 전 반드시 복구
- **`NEXTAUTH_SECRET`**: 약한 시크릿 사용 중, 강력한 값으로 교체 필요
- **`KAKAO_CLIENT_SECRET`**: 빈 값 허용 중 (`|| ""`)
- **DB ENUM 불일치**: `user_status`에 `rejected`가 없음 (앱에서만 사용). 마이그레이션 추가 필요

### TODO 주석
- `components/home/LatestReviews.tsx` — 실제 데이터로 대체 예정
- `components/home/HeroSection.tsx` — 실제 데이터로 대체 예정
- `components/home/PopularHeadhunters.tsx` — 실제 데이터로 대체 예정
- `app/(public)/headhunters/page.tsx` — 실제 데이터로 대체 예정
- `app/(public)/firms/page.tsx` — 실제 데이터로 대체 예정
- `app/(public)/reviews/new/page.tsx` — 실제 데이터로 대체 예정

### 타입/스키마 불일치
- `lib/types/index.ts`의 `Review.nps_score` (0-10) vs DB `rating_overall` (1-5)
- `lib/types/index.ts`의 `Review.job_field` vs DB의 `industry` + `job_function` 분리
- `UserProfile`에 `provider`, `avatar_url` 등 DB에 없는 필드 존재 (프론트 전용)

### 미사용 파일
- `components/headhunter/RadarChart.tsx` — 구현되었지만 어디서도 사용하지 않음

## 9. 개발 로드맵

### Phase 1 - MVP (완료)
- [x] 인증 (OAuth + 이메일)
- [x] 헤드헌터/서치펌 CRUD + 검색
- [x] 리뷰 시스템
- [x] 아티클
- [x] 기본 마이페이지

### Phase 2 - 고급 기능 (완료)
- [x] 헤드헌터 프로필 클레임
- [x] 헤드헌터 전용 대시보드
- [x] 업적 시스템
- [x] 커뮤니티 (DB/UI 완성, 비활성)
- [x] 온보딩 닉네임

### Phase 3 - 배포 준비 (진행 중)
- [ ] 미들웨어 인증 복구 (QA MODE 해제)
- [ ] mock 데이터 → 실제 API 전환
- [ ] 환경변수 보안 강화
- [ ] DB ENUM 정리 (`rejected` 추가)
- [ ] 에러 바운더리 추가
- [ ] SEO 메타태그

### Phase 4 - Post-MVP
- [ ] 커뮤니티 오픈
- [ ] 관리자 대시보드
- [ ] 리뷰 좋아요/신고 시스템
- [ ] 초대 시스템 (업적 연동)
- [ ] 이메일 알림 (인증 결과, 리뷰 답글 등)
- [ ] 헤드헌터 순위/랭킹 시스템
- [ ] 검색 고도화 (풀텍스트 검색)

## 10. 자주 발생하는 문제 및 해결법

### RLS 권한 오류
**증상**: Supabase 쿼리가 빈 결과를 반환하거나 권한 에러 발생
**원인**: RLS 정책이 anon key 기반 접근을 차단
**해결**: 반드시 `createAdminClient()` 사용 (service_role key로 RLS 우회)

### ENUM 불일치
**증상**: INSERT 시 `invalid input value for enum` 에러
**해결**: `lib/constants.ts`, `lib/review-constants.ts`의 값과 DB ENUM이 정확히 일치하는지 확인. 특히 `user_status`에 `rejected`가 DB에 없음 주의

### Mock 데이터 타입 에러
**증상**: `lib/mock-data.ts` 수정 후 빌드 에러
**해결**: `lib/types/index.ts`의 인터페이스 변경 시 mock 데이터도 반드시 함께 업데이트

### Supabase RPC 타입 에러
**증상**: `.catch()` 등 Promise 메서드가 Supabase 반환타입에 없다는 에러
**해결**: Supabase 클라이언트의 반환값은 표준 Promise가 아님. `.then()/.catch()` 대신 `const { data, error } = await ...` 패턴 사용

### Recharts 타입 에러
**증상**: Tooltip `formatter` 등의 타입 불일치
**해결**: 콜백 파라미터에 명시적 타입 대신 `(value)` + `Number(value)` 패턴 사용

### 환경변수 누락
**증상**: 로컬에서는 동작하지만 Vercel 배포 후 에러
**해결**: Vercel 대시보드에서 모든 환경변수 등록 필요 (특히 `SUPABASE_SERVICE_ROLE_KEY`)

### 빌드 시 downlevelIteration 에러
**증상**: `Set`이나 `Map` 순회 시 타입 에러
**해결**: `tsconfig.json`에 `downlevelIteration` 미사용. `Array.from(set)` 또는 스프레드 대신 for-of 사용

## 마이그레이션 파일 순서

```
001_initial_schema.sql        -- 기본 테이블 (users, headhunters, search_firms, reviews, articles, claim_requests)
002_add_password_hash.sql     -- password_hash 컬럼
003_seed_articles.sql         -- 아티클 시드 데이터
004_fix_rating_overall.sql    -- rating_overall 수정
005_add_rejected_status.sql   -- rejected 상태 추가
006_add_is_welcomed.sql       -- is_welcomed 컬럼
007_add_verification_level.sql -- verification_level 관련
008_seed_demo_data.sql        -- 데모 데이터 시드
009_company_size_and_positions.sql -- company_size ENUM, headhunter_positions
010_headhunter_dashboard.sql  -- bio, headhunter_contacts, interest_count
011_community_and_nickname.sql -- nickname, 커뮤니티 테이블 4개
012_achievements.sql          -- 업적 테이블 4개 + 30개 시드
013_add_user_fields.sql       -- 로그인 스트릭 컬럼 (last_login_at, login_streak, total_login_days)
```
