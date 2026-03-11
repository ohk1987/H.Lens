-- 010: 헤드헌터 대시보드 관련 스키마

-- 1. headhunters 테이블에 bio 컬럼 추가
ALTER TABLE headhunters ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. headhunter_contacts 테이블 (구직자 "관심 있어요")
CREATE TABLE IF NOT EXISTS headhunter_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headhunter_id UUID NOT NULL REFERENCES headhunters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position_id UUID REFERENCES headhunter_positions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, position_id)
);

-- RLS 활성화
ALTER TABLE headhunter_contacts ENABLE ROW LEVEL SECURITY;

-- 누구나 자신의 관심 표현 가능
CREATE POLICY "Users can insert own contacts"
  ON headhunter_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 헤드헌터 소유자만 조회 가능
CREATE POLICY "Headhunter owner can view contacts"
  ON headhunter_contacts FOR SELECT
  USING (
    headhunter_id IN (
      SELECT id FROM headhunters WHERE claimed_by = auth.uid()
    )
  );

-- 본인의 관심 표현 삭제 가능
CREATE POLICY "Users can delete own contacts"
  ON headhunter_contacts FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_headhunter_contacts_headhunter_id ON headhunter_contacts(headhunter_id);
CREATE INDEX IF NOT EXISTS idx_headhunter_contacts_position_id ON headhunter_contacts(position_id);

-- headhunter_positions 테이블에 interest_count 컬럼 추가
ALTER TABLE headhunter_positions ADD COLUMN IF NOT EXISTS interest_count INT NOT NULL DEFAULT 0;
