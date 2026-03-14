-- ============================================================
-- 017: QA용 테스트 계정 3개 생성
-- ============================================================
--
-- [고정 UUID]
-- test1 (구직자)    : e0000000-0000-0000-0000-000000000001
-- test2 (HR담당자)  : e0000000-0000-0000-0000-000000000002
-- test3 (헤드헌터)  : e0000000-0000-0000-0000-000000000003
--
-- [주의]
-- - Supabase Auth(auth.users)는 이 SQL로 생성 불가
-- - 이 SQL은 public.users 테이블에만 INSERT
-- - 실제 로그인하려면 아래 작업이 필요:
--
--   1) Supabase Dashboard > Authentication > Users > Add User
--      test1@hlens.app / Test1234!
--      test2@hlens.app / Test1234!
--      test3@hlens.app / Test1234!
--
--   2) auth.users에 자동 생성된 UUID를 확인하고,
--      public.users의 id를 auth.users의 id와 일치시켜야 함.
--      방법 A: Dashboard에서 먼저 유저를 만든 뒤 아래 UUID를 해당 값으로 수정
--      방법 B: 이 SQL을 먼저 실행한 뒤, Dashboard에서 유저 생성 시
--              auth.users의 UUID가 다르면 아래 UPDATE로 맞춤:
--
--      UPDATE users SET id = '실제auth-uuid' WHERE email = 'test1@hlens.app';
--
-- ============================================================

-- ===== test1: 구직자 (활성) =====
INSERT INTO users (
  id, email, name, user_type, status,
  nickname, is_welcomed,
  login_streak, total_login_days,
  agreed_terms_at, created_at
)
VALUES (
  'e0000000-0000-0000-0000-000000000001',
  'test1@hlens.app',
  '테스트 구직자',
  'job_seeker',
  'active',
  '테스트구직자',
  true,
  0, 0,
  now(), now()
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  user_type = EXCLUDED.user_type,
  status = EXCLUDED.status,
  nickname = EXCLUDED.nickname,
  is_welcomed = EXCLUDED.is_welcomed;

-- ===== test2: HR담당자 (인증 대기중) =====
INSERT INTO users (
  id, email, name, user_type, status,
  nickname, company_email, is_welcomed,
  login_streak, total_login_days,
  agreed_terms_at, created_at
)
VALUES (
  'e0000000-0000-0000-0000-000000000002',
  'test2@hlens.app',
  '테스트 HR담당자',
  'hr_manager',
  'pending',
  '테스트HR담당자',
  'test2@testcompany.com',
  true,
  0, 0,
  now(), now()
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  user_type = EXCLUDED.user_type,
  status = EXCLUDED.status,
  nickname = EXCLUDED.nickname,
  company_email = EXCLUDED.company_email,
  is_welcomed = EXCLUDED.is_welcomed;

-- ===== test3: 헤드헌터 (활성) =====
INSERT INTO users (
  id, email, name, user_type, status,
  nickname, is_welcomed,
  login_streak, total_login_days,
  agreed_terms_at, created_at
)
VALUES (
  'e0000000-0000-0000-0000-000000000003',
  'test3@hlens.app',
  '테스트 헤드헌터',
  'headhunter',
  'active',
  '테스트헤드헌터',
  true,
  0, 0,
  now(), now()
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  user_type = EXCLUDED.user_type,
  status = EXCLUDED.status,
  nickname = EXCLUDED.nickname,
  is_welcomed = EXCLUDED.is_welcomed;

-- ===== test3 헤드헌터 프로필 연결 =====
-- headhunters 테이블의 첫 번째 레코드를 test3 계정에 클레임 연결
UPDATE headhunters
SET claimed_by = 'e0000000-0000-0000-0000-000000000003',
    is_claimed = true
WHERE id = (
  SELECT id FROM headhunters ORDER BY created_at ASC LIMIT 1
)
AND claimed_by IS NULL;
