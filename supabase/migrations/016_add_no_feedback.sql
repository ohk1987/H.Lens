-- 016: 진행 결과(progress_result) ENUM에 'no_feedback' 값 추가
-- "안내받지 못함" 선택지 지원

ALTER TYPE progress_result ADD VALUE IF NOT EXISTS 'no_feedback';
