-- 015: rating 컬럼을 smallint에서 numeric(3,1)으로 변경
-- 0.5점 단위 소수점 저장 가능하게 (예: 2.5, 3.5, 4.0)

-- 공통 평점 컬럼 변경
ALTER TABLE reviews
  ALTER COLUMN rating_professionalism TYPE numeric(3,1),
  ALTER COLUMN rating_communication TYPE numeric(3,1),
  ALTER COLUMN rating_reliability TYPE numeric(3,1),
  ALTER COLUMN rating_support TYPE numeric(3,1),
  ALTER COLUMN rating_transparency TYPE numeric(3,1),
  ALTER COLUMN rating_overall TYPE numeric(3,1);

-- HR 담당자 전용 평점 컬럼 변경
ALTER TABLE reviews
  ALTER COLUMN rating_fee TYPE numeric(3,1),
  ALTER COLUMN rating_guarantee TYPE numeric(3,1),
  ALTER COLUMN rating_contract TYPE numeric(3,1);
