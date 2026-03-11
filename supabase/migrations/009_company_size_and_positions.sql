-- ===== 기업 구분 ENUM + 리뷰 컬럼 추가 =====
DO $$ BEGIN
  CREATE TYPE company_size AS ENUM ('startup', 'small', 'medium', 'large', 'foreign');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS company_size company_size;

-- ===== 헤드헌터 포지션 테이블 =====
CREATE TABLE IF NOT EXISTS headhunter_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headhunter_id UUID NOT NULL REFERENCES headhunters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size company_size NOT NULL,
  career_min INT NOT NULL DEFAULT 0,
  career_max INT NOT NULL DEFAULT 0,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE headhunter_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "positions_select_all" ON headhunter_positions
  FOR SELECT USING (true);

CREATE POLICY "positions_insert_owner" ON headhunter_positions
  FOR INSERT WITH CHECK (
    headhunter_id IN (
      SELECT id FROM headhunters WHERE claimed_by = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    )
  );

CREATE POLICY "positions_update_owner" ON headhunter_positions
  FOR UPDATE USING (
    headhunter_id IN (
      SELECT id FROM headhunters WHERE claimed_by = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    )
  );

CREATE POLICY "positions_delete_owner" ON headhunter_positions
  FOR DELETE USING (
    headhunter_id IN (
      SELECT id FROM headhunters WHERE claimed_by = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
    )
  );

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_positions_headhunter ON headhunter_positions(headhunter_id);
CREATE INDEX IF NOT EXISTS idx_positions_active ON headhunter_positions(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_company_size ON reviews(company_size);
