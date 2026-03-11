# H.Lens - 헤드헌터 리뷰 플랫폼

한국 채용시장의 헤드헌터(서치펌 컨설턴트) 리뷰 플랫폼입니다.
구직자, HR담당자, 헤드헌터가 각각의 관점에서 헤드헌터를 평가하고 정보를 공유합니다.

**배포 URL**: https://hlens.vercel.app

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth v4 (Google, Kakao, Email)
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts
- **Deploy**: Vercel

## 로컬 개발 환경 세팅

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성합니다:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_strong_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Kakao OAuth
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
```

### 3. Supabase 설정

Supabase 프로젝트 생성 후 `supabase/migrations/` 폴더의 SQL 파일을 순서대로 실행합니다:

```
001_initial_schema.sql → 013_add_user_fields.sql
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 주요 기능

- **헤드헌터 리뷰**: 5단계 위자드 형태의 리뷰 작성 (구직자/HR 분기)
- **헤드헌터 프로필**: 평점, 리뷰, 트렌드 차트, 포지션 정보
- **서치펌 정보**: 서치펌 목록 및 소속 헤드헌터 조회
- **헤드헌터 대시보드**: 프로필 클레임 후 통계, 리뷰 답글, 포지션 관리
- **업적 시스템**: 30개 업적, 진행도 추적, 대표배지 설정
- **커뮤니티**: 사용자 유형별 게시판 (준비 중)
- **아티클**: 채용 관련 정보 콘텐츠

## 빌드 & 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 로컬 실행
npm start
```

Vercel에 연결된 Git 저장소에 push하면 자동 배포됩니다.

## 프로젝트 구조

```
app/
├── (auth)/       # 인증 (로그인, 회원가입, 온보딩)
├── (public)/     # 공개 페이지 (홈, 헤드헌터, 서치펌, 아티클, 커뮤니티)
├── (dashboard)/  # 마이페이지, 헤드헌터 대시보드
└── api/          # API 라우트

components/       # React 컴포넌트
lib/              # 유틸리티, 타입, 상수, Supabase 클라이언트
supabase/         # DB 마이그레이션, 시드 데이터
```

자세한 구조와 개발 규칙은 `CLAUDE.md`를 참고하세요.
