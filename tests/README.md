# H.Lens E2E 테스트

Playwright 기반 E2E 테스트입니다.

## 준비사항

1. 의존성 설치
```bash
npm install
npx playwright install chromium
```

2. 테스트 계정이 DB에 존재해야 합니다 (`supabase/migrations/017_test_accounts.sql` 참고)

| 계정 | 이메일 | 비밀번호 | 유형 |
|------|--------|----------|------|
| test1 | test1@hlens.app | Test1234! | 구직자 (job_seeker) |
| test2 | test2@hlens.app | Test1234! | HR 담당자 (hr_manager) |
| test3 | test3@hlens.app | Test1234! | 헤드헌터 (headhunter) |

3. 로컬 개발 서버 실행 (자동 실행됨, 이미 실행 중이면 재사용)
```bash
npm run dev
```

## 실행 명령어

```bash
# 전체 테스트 실행
npm run test:e2e

# UI 모드 (브라우저에서 단계별 확인)
npm run test:e2e:ui

# 특정 테스트 파일만 실행
npx playwright test tests/01-layout.spec.ts

# 특정 테스트만 실행
npx playwright test -g "홈 페이지 정상 로드"

# headed 모드 (브라우저 보이게)
npx playwright test --headed
```

## 결과 확인

```bash
# HTML 리포트 열기
npm run test:e2e:report
```

- 스크린샷: `test-results/` 폴더 (실패 시 자동 캡처)
- HTML 리포트: `playwright-report/` 폴더

## 테스트 구조

| 파일 | 설명 | 로그인 필요 |
|------|------|------------|
| 01-layout.spec.ts | 헤더/푸터 공통 레이아웃 | X |
| 02-home.spec.ts | 홈 화면 | X |
| 03-headhunters.spec.ts | 헤드헌터 목록/프로필 | X |
| 04-firms.spec.ts | 서치펌 목록/상세 | X |
| 05-auth.spec.ts | 로그인/로그아웃 | O (test1) |
| 06-review.spec.ts | 리뷰 작성 전체 플로우 | O (test1) |
| 07-mypage.spec.ts | 마이페이지 | O (test1, test2) |
| 08-headhunter-dashboard.spec.ts | 헤드헌터 대시보드 | O (test3) |
| 09-pages.spec.ts | 정보 페이지 (약관 등) | X |

## 주의사항

- 각 테스트는 독립적으로 실행 가능합니다
- 리뷰 작성 테스트는 실제 DB에 데이터를 생성합니다
- 공개 페이지 테스트는 read-only이므로 안전합니다
