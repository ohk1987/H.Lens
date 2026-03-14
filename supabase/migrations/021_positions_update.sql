-- 021: 포지션 테이블에 실제 회사명, 공개용 회사 소개 컬럼 추가
-- conversations 상태 확장

-- 포지션 테이블 컬럼 추가
ALTER TABLE headhunter_positions
ADD COLUMN actual_company_name TEXT,
ADD COLUMN company_description TEXT;

-- conversations 상태 확장 (칸반 보드용)
-- pending: 관심 표현 (신규)
-- active: 메시지 중
-- reviewing: 서류 검토
-- interview: 인터뷰
-- completed: 완료
-- unmatched: 미매칭
-- 기존 pending, active 외 새 상태 추가 (TEXT 타입이므로 별도 ALTER 불필요)

COMMENT ON COLUMN headhunter_positions.actual_company_name IS '실제 회사명 (비공개, 헤드헌터만 확인 가능)';
COMMENT ON COLUMN headhunter_positions.company_description IS '공개용 회사 소개 (구직자에게 표시)';
