-- user_status ENUM에 'rejected' 값 추가
ALTER TYPE user_status ADD VALUE IF NOT EXISTS 'rejected';
