-- rating_overall을 SMALLINT에서 NUMERIC(2,1)로 변경하여 반점수(3.5 등) 지원
-- 현재는 API에서 Math.round()로 처리하지만, 향후 정밀도가 필요할 때 이 마이그레이션 적용

-- ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_rating_overall_check;
-- ALTER TABLE reviews ALTER COLUMN rating_overall TYPE NUMERIC(2,1);
-- ALTER TABLE reviews ADD CONSTRAINT reviews_rating_overall_check CHECK (rating_overall BETWEEN 1 AND 5);
