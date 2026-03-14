-- 022: 포인트 시스템
-- 실행 전 필요: 019, 020, 021 완료 확인

-- 포인트 적립/차감 내역
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- users 테이블에 총 포인트 컬럼 추가
ALTER TABLE users
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;

-- 인덱스
CREATE INDEX idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_type ON point_transactions(user_id, transaction_type);
CREATE INDEX idx_point_transactions_ref ON point_transactions(reference_id, transaction_type);
CREATE INDEX idx_point_transactions_date ON point_transactions(user_id, created_at);

COMMENT ON TABLE point_transactions IS '포인트 적립/차감 내역';
COMMENT ON COLUMN point_transactions.points IS '양수: 적립, 음수: 차감';
COMMENT ON COLUMN point_transactions.transaction_type IS 'review_write, review_verified, community_post, community_comment, login_streak_7, login_streak_30, achievement, position_register, review_reply, response_rate_90 등';
COMMENT ON COLUMN point_transactions.reference_id IS '리뷰ID, 게시글ID, 업적ID 등 참조';
COMMENT ON COLUMN point_transactions.reference_type IS 'review, community_post, achievement 등';
