-- 018_fix_rating_constraints.sql
-- 기존 rating check constraint 제거 후 0.5~5.0 범위로 재생성
-- 원인: 0.5 단위 소수점 별점이 기존 정수 전용 constraint에 위배됨

-- 기존 constraint 제거
ALTER TABLE reviews
DROP CONSTRAINT IF EXISTS reviews_rating_communication_check,
DROP CONSTRAINT IF EXISTS reviews_rating_professionalism_check,
DROP CONSTRAINT IF EXISTS reviews_rating_reliability_check,
DROP CONSTRAINT IF EXISTS reviews_rating_support_check,
DROP CONSTRAINT IF EXISTS reviews_rating_transparency_check,
DROP CONSTRAINT IF EXISTS reviews_rating_overall_check,
DROP CONSTRAINT IF EXISTS reviews_rating_fee_check,
DROP CONSTRAINT IF EXISTS reviews_rating_guarantee_check,
DROP CONSTRAINT IF EXISTS reviews_rating_contract_check;

-- 0.5~5.0 범위로 새 constraint 추가
ALTER TABLE reviews
ADD CONSTRAINT reviews_rating_professionalism_check
  CHECK (rating_professionalism >= 0.5 AND rating_professionalism <= 5.0),
ADD CONSTRAINT reviews_rating_communication_check
  CHECK (rating_communication >= 0.5 AND rating_communication <= 5.0),
ADD CONSTRAINT reviews_rating_reliability_check
  CHECK (rating_reliability >= 0.5 AND rating_reliability <= 5.0),
ADD CONSTRAINT reviews_rating_support_check
  CHECK (rating_support >= 0.5 AND rating_support <= 5.0),
ADD CONSTRAINT reviews_rating_transparency_check
  CHECK (rating_transparency >= 0.5 AND rating_transparency <= 5.0),
ADD CONSTRAINT reviews_rating_overall_check
  CHECK (rating_overall >= 0.5 AND rating_overall <= 5.0),
ADD CONSTRAINT reviews_rating_fee_check
  CHECK (rating_fee >= 0.5 AND rating_fee <= 5.0),
ADD CONSTRAINT reviews_rating_guarantee_check
  CHECK (rating_guarantee >= 0.5 AND rating_guarantee <= 5.0),
ADD CONSTRAINT reviews_rating_contract_check
  CHECK (rating_contract >= 0.5 AND rating_contract <= 5.0);
