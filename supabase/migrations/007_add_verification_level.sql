-- 헤드헌터 인증 등급 컬럼 추가
-- none: 미인증 (리뷰어가 등록, 클레임 전)
-- claimed: 본인 인증 (클레임 완료 + 관리자 승인)
-- verified: 재직 인증 (재직증명서 제출 + 관리자 확인)

DO $$ BEGIN
  CREATE TYPE verification_level AS ENUM ('none', 'claimed', 'verified');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE headhunters ADD COLUMN IF NOT EXISTS verification_level verification_level DEFAULT 'none';
