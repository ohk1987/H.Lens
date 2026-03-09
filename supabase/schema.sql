-- ===== H.Lens Supabase 스키마 v2 =====
-- 인증 시스템 + 서치펌 + 클레임 로직 포함

-- ===== ENUM 타입 =====
CREATE TYPE user_type AS ENUM ('job_seeker', 'hr_manager', 'headhunter');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE review_type AS ENUM ('verified', 'general');
CREATE TYPE trust_badge_level AS ENUM ('none', 'partial', 'full');
CREATE TYPE firm_status AS ENUM ('active', 'inactive');

-- ===== 사용자 프로필 테이블 =====
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  user_type user_type NOT NULL DEFAULT 'job_seeker',
  status user_status NOT NULL DEFAULT 'active',
  -- HR 담당자 / 헤드헌터용 추가 필드
  company_email TEXT,
  company_email_verified BOOLEAN NOT NULL DEFAULT false,
  business_card_url TEXT,
  -- 약관 동의
  agreed_terms_at TIMESTAMPTZ,
  -- 소셜 로그인 정보
  provider TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 새 사용자 가입 시 자동으로 프로필 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type user_type;
  v_status user_status;
BEGIN
  -- user_type 결정
  v_user_type := COALESCE(
    (NEW.raw_user_meta_data->>'user_type')::user_type,
    'job_seeker'
  );

  -- status 결정: 헤드헌터는 pending, 나머지는 active
  IF v_user_type = 'headhunter' THEN
    v_status := 'pending';
  ELSE
    v_status := 'active';
  END IF;

  INSERT INTO public.profiles (
    id, email, nickname, user_type, status,
    provider, avatar_url
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.raw_user_meta_data->>'name', ''),
    v_user_type,
    v_status,
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== 서치펌 테이블 =====
CREATE TABLE search_firms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  website TEXT,
  description TEXT,
  specialty_fields TEXT[] NOT NULL DEFAULT '{}',
  email_domain TEXT,
  status firm_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== 헤드헌터 테이블 =====
CREATE TABLE headhunters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  search_firm_id UUID REFERENCES search_firms(id) ON DELETE SET NULL,
  firm_name TEXT NOT NULL,
  specialty_fields TEXT[] NOT NULL DEFAULT '{}',
  total_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  verified_review_count INTEGER NOT NULL DEFAULT 0,
  trust_badge_level trust_badge_level NOT NULL DEFAULT 'none',
  linkedin_url TEXT,
  profile_image TEXT,
  phone TEXT,
  email TEXT,
  -- 클레임 관련
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== 리뷰 테이블 =====
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headhunter_id UUID NOT NULL REFERENCES headhunters(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_type user_type NOT NULL,
  review_type review_type NOT NULL DEFAULT 'general',
  contact_date DATE NOT NULL,
  job_field TEXT NOT NULL,
  contact_channel TEXT NOT NULL,
  -- 평가 항목 (1~5)
  rating_professionalism SMALLINT NOT NULL CHECK (rating_professionalism BETWEEN 1 AND 5),
  rating_communication SMALLINT NOT NULL CHECK (rating_communication BETWEEN 1 AND 5),
  rating_reliability SMALLINT NOT NULL CHECK (rating_reliability BETWEEN 1 AND 5),
  rating_support SMALLINT NOT NULL CHECK (rating_support BETWEEN 1 AND 5),
  rating_transparency SMALLINT NOT NULL CHECK (rating_transparency BETWEEN 1 AND 5),
  -- 키워드
  keywords_positive TEXT[] NOT NULL DEFAULT '{}',
  keywords_negative TEXT[] NOT NULL DEFAULT '{}',
  -- 내용
  content TEXT NOT NULL,
  nps_score SMALLINT NOT NULL CHECK (nps_score BETWEEN 0 AND 10),
  headhunter_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== 헤드헌터 클레임 요청 테이블 =====
CREATE TABLE claim_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headhunter_id UUID NOT NULL REFERENCES headhunters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  evidence_url TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE(headhunter_id, user_id)
);

-- ===== 트리거: 리뷰 통계 자동 업데이트 =====
CREATE OR REPLACE FUNCTION public.update_headhunter_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE headhunters
  SET
    review_count = (SELECT COUNT(*) FROM reviews WHERE headhunter_id = NEW.headhunter_id),
    verified_review_count = (SELECT COUNT(*) FROM reviews WHERE headhunter_id = NEW.headhunter_id AND review_type = 'verified'),
    total_rating = (
      SELECT ROUND(AVG(
        (rating_professionalism + rating_communication + rating_reliability + rating_support + rating_transparency)::NUMERIC / 5
      ), 2)
      FROM reviews WHERE headhunter_id = NEW.headhunter_id
    )
  WHERE id = NEW.headhunter_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_changed
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_headhunter_stats();

-- ===== 트리거: 클레임 승인 시 헤드헌터 업데이트 =====
CREATE OR REPLACE FUNCTION public.handle_claim_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE headhunters
    SET claimed_by = NEW.user_id, is_claimed = true
    WHERE id = NEW.headhunter_id;

    UPDATE profiles
    SET status = 'active'
    WHERE id = NEW.user_id AND user_type = 'headhunter';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_claim_status_changed
  AFTER UPDATE OF status ON claim_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_claim_approved();

-- ===== RLS (Row Level Security) =====

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "프로필 공개 조회" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "본인 프로필 수정" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Search Firms
ALTER TABLE search_firms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "서치펌 공개 조회" ON search_firms
  FOR SELECT USING (true);

-- Headhunters
ALTER TABLE headhunters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "헤드헌터 공개 조회" ON headhunters
  FOR SELECT USING (true);

CREATE POLICY "로그인 사용자 헤드헌터 생성" ON headhunters
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "클레임한 본인만 헤드헌터 수정" ON headhunters
  FOR UPDATE USING (claimed_by = auth.uid());

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "리뷰 공개 조회" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "로그인 사용자만 리뷰 작성" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "본인 리뷰만 수정" ON reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "본인 리뷰만 삭제" ON reviews
  FOR DELETE USING (auth.uid() = reviewer_id);

-- Claim Requests
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 클레임 요청 조회" ON claim_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "로그인 사용자 클레임 요청 생성" ON claim_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===== 인덱스 =====
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_search_firms_name ON search_firms(name);
CREATE INDEX idx_search_firms_email_domain ON search_firms(email_domain);
CREATE INDEX idx_headhunters_search_firm_id ON headhunters(search_firm_id);
CREATE INDEX idx_headhunters_claimed_by ON headhunters(claimed_by);
CREATE INDEX idx_headhunters_email ON headhunters(email);
CREATE INDEX idx_headhunters_phone ON headhunters(phone);
CREATE INDEX idx_headhunters_total_rating ON headhunters(total_rating DESC);
CREATE INDEX idx_headhunters_specialty ON headhunters USING GIN(specialty_fields);
CREATE INDEX idx_reviews_headhunter_id ON reviews(headhunter_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_claim_requests_headhunter ON claim_requests(headhunter_id);
CREATE INDEX idx_claim_requests_user ON claim_requests(user_id);

-- ===== Storage Bucket (명함/증빙서류) =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-docs', 'verification-docs', false)
ON CONFLICT DO NOTHING;

CREATE POLICY "본인 파일 업로드" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "본인 파일 조회" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
