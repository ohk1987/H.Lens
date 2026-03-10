-- 웰컴 페이지 표시 여부 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_welcomed BOOLEAN DEFAULT false;
