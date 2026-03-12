-- 015: rating 컬럼을 smallint에서 numeric(3,1)로 변경 (0.5점 단위 저장)
-- + progress_result ENUM에 'no_feedback' 값 추가

-- 1. rating 컬럼 타입 변경
ALTER TABLE reviews
  ALTER COLUMN rating_professionalism TYPE numeric(3,1),
  ALTER COLUMN rating_communication TYPE numeric(3,1),
  ALTER COLUMN rating_reliability TYPE numeric(3,1),
  ALTER COLUMN rating_support TYPE numeric(3,1),
  ALTER COLUMN rating_transparency TYPE numeric(3,1),
  ALTER COLUMN rating_overall TYPE numeric(3,1);

-- HR 전용 평점 컬럼도 변경 (컬럼명은 실제 DB 스키마에 따라 조정)
DO $$
BEGIN
  -- hr_rating_* 컬럼이 존재하면 변경
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='hr_rating_fee') THEN
    ALTER TABLE reviews ALTER COLUMN hr_rating_fee TYPE numeric(3,1);
    ALTER TABLE reviews ALTER COLUMN hr_rating_guarantee TYPE numeric(3,1);
    ALTER TABLE reviews ALTER COLUMN hr_rating_contract TYPE numeric(3,1);
  END IF;
  -- rating_fee 컬럼이 존재하면 변경
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='rating_fee') THEN
    ALTER TABLE reviews ALTER COLUMN rating_fee TYPE numeric(3,1);
    ALTER TABLE reviews ALTER COLUMN rating_guarantee TYPE numeric(3,1);
    ALTER TABLE reviews ALTER COLUMN rating_contract TYPE numeric(3,1);
  END IF;
END $$;

-- 2. progress_result ENUM에 'no_feedback' 추가
ALTER TYPE progress_result ADD VALUE IF NOT EXISTS 'no_feedback';
