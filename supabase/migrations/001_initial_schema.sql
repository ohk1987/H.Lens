-- ===== H.Lens 초기 스키마 =====
-- 사용자, 서치펌, 헤드헌터, 리뷰, 아티클

-- ===== ENUM 타입 =====
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('job_seeker', 'hr_manager', 'headhunter');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE review_kind AS ENUM ('general', 'verified');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('none', 'pending', 'verified');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE contact_channel AS ENUM ('linkedin', 'email', 'phone', 'job_site', 'referral', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE progress_result AS ENUM ('in_progress', 'hired', 'rejected', 'dropped');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE article_target AS ENUM ('job_seeker', 'hr_manager', 'headhunter', 'all');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE firm_status AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ===== users 테이블 =====
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  user_type user_type,  -- NULL = 아직 유형 미선택 (소셜 로그인 직후)
  status user_status NOT NULL DEFAULT 'active',
  company_email TEXT,
  business_card_url TEXT,
  agreed_terms_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== search_firms 테이블 =====
CREATE TABLE IF NOT EXISTS search_firms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  website TEXT,
  description TEXT,
  specialty_fields TEXT[] NOT NULL DEFAULT '{}',
  status firm_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== headhunters 테이블 =====
CREATE TABLE IF NOT EXISTS headhunters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  search_firm_id UUID REFERENCES search_firms(id) ON DELETE SET NULL,
  claimed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  profile_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== reviews 테이블 =====
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headhunter_id UUID NOT NULL REFERENCES headhunters(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_type user_type NOT NULL,
  review_type review_kind NOT NULL DEFAULT 'general',
  verification_status verification_status NOT NULL DEFAULT 'none',
  -- 컨택 정보
  contact_date DATE NOT NULL,
  contact_channel contact_channel NOT NULL,
  company_name TEXT,  -- 비공개
  industry TEXT NOT NULL,
  job_function TEXT NOT NULL,
  career_level TEXT NOT NULL,
  result progress_result NOT NULL DEFAULT 'in_progress',
  -- 공통 평가 항목 (1~5)
  rating_professionalism SMALLINT NOT NULL CHECK (rating_professionalism BETWEEN 1 AND 5),
  rating_communication SMALLINT NOT NULL CHECK (rating_communication BETWEEN 1 AND 5),
  rating_reliability SMALLINT NOT NULL CHECK (rating_reliability BETWEEN 1 AND 5),
  rating_support SMALLINT NOT NULL CHECK (rating_support BETWEEN 1 AND 5),
  rating_transparency SMALLINT NOT NULL CHECK (rating_transparency BETWEEN 1 AND 5),
  rating_overall SMALLINT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  -- HR 전용 평가 (nullable)
  hr_rating_fee SMALLINT CHECK (hr_rating_fee IS NULL OR hr_rating_fee BETWEEN 1 AND 5),
  hr_rating_guarantee SMALLINT CHECK (hr_rating_guarantee IS NULL OR hr_rating_guarantee BETWEEN 1 AND 5),
  hr_rating_contract SMALLINT CHECK (hr_rating_contract IS NULL OR hr_rating_contract BETWEEN 1 AND 5),
  -- 키워드 & 내용
  keywords_positive TEXT[] NOT NULL DEFAULT '{}',
  keywords_negative TEXT[] NOT NULL DEFAULT '{}',
  content TEXT NOT NULL CHECK (char_length(content) >= 50),
  recommend BOOLEAN NOT NULL,
  -- 증빙 파일
  evidence_file_url TEXT,
  -- 헤드헌터 답글
  headhunter_reply TEXT,
  headhunter_replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== articles 테이블 =====
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  target_type article_target NOT NULL DEFAULT 'all',
  category TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== claim_requests 테이블 =====
CREATE TABLE IF NOT EXISTS claim_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headhunter_id UUID NOT NULL REFERENCES headhunters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  evidence_url TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE(headhunter_id, user_id)
);

-- ===== 트리거: 리뷰 작성/변경 시 증빙 기반으로 review_type 자동 결정 =====
CREATE OR REPLACE FUNCTION public.set_review_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.evidence_file_url IS NOT NULL THEN
    NEW.verification_status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_review_verification ON reviews;
CREATE TRIGGER trg_review_verification
  BEFORE INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_review_verification();

-- ===== 트리거: 클레임 승인 시 헤드헌터 연결 =====
CREATE OR REPLACE FUNCTION public.handle_claim_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE headhunters
    SET claimed_by = NEW.user_id, is_claimed = true
    WHERE id = NEW.headhunter_id;

    UPDATE users
    SET status = 'active'
    WHERE id = NEW.user_id AND user_type = 'headhunter';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_claim_status_changed ON claim_requests;
CREATE TRIGGER on_claim_status_changed
  AFTER UPDATE OF status ON claim_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_claim_approved();

-- ===== RLS =====

-- users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_all" ON users
  FOR SELECT USING (true);

CREATE POLICY "users_insert_self" ON users
  FOR INSERT WITH CHECK (true);  -- next-auth가 생성

CREATE POLICY "users_update_self" ON users
  FOR UPDATE USING (id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

-- search_firms
ALTER TABLE search_firms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "firms_select_all" ON search_firms
  FOR SELECT USING (true);

-- headhunters
ALTER TABLE headhunters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "headhunters_select_all" ON headhunters
  FOR SELECT USING (true);

CREATE POLICY "headhunters_insert_auth" ON headhunters
  FOR INSERT WITH CHECK (true);

CREATE POLICY "headhunters_update_claimed" ON headhunters
  FOR UPDATE USING (
    claimed_by = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_auth" ON reviews
  FOR INSERT WITH CHECK (
    reviewer_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

CREATE POLICY "reviews_update_self" ON reviews
  FOR UPDATE USING (
    reviewer_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

-- articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "articles_select_all" ON articles
  FOR SELECT USING (true);

-- 관리자만 삽입/수정 (service_role 키 사용 또는 is_admin 체크)
CREATE POLICY "articles_insert_admin" ON articles
  FOR INSERT WITH CHECK (false);  -- service_role 키로만 가능

CREATE POLICY "articles_update_admin" ON articles
  FOR UPDATE USING (false);

-- claim_requests
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "claims_select_self" ON claim_requests
  FOR SELECT USING (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

CREATE POLICY "claims_insert_self" ON claim_requests
  FOR INSERT WITH CHECK (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid
  );

-- ===== 인덱스 =====
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_firms_name ON search_firms(name);
CREATE INDEX IF NOT EXISTS idx_headhunters_search_firm ON headhunters(search_firm_id);
CREATE INDEX IF NOT EXISTS idx_headhunters_claimed_by ON headhunters(claimed_by);
CREATE INDEX IF NOT EXISTS idx_headhunters_email ON headhunters(email);
CREATE INDEX IF NOT EXISTS idx_headhunters_phone ON headhunters(phone);
CREATE INDEX IF NOT EXISTS idx_reviews_headhunter ON reviews(headhunter_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_target ON articles(target_type);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_claims_headhunter ON claim_requests(headhunter_id);
CREATE INDEX IF NOT EXISTS idx_claims_user ON claim_requests(user_id);

-- ===== Storage Bucket =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-docs', 'verification-docs', false)
ON CONFLICT DO NOTHING;
