-- users 테이블에 password_hash 컬럼 추가 (이메일 가입 시 bcrypt 해시 저장)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
