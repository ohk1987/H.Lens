-- 012: 업적 시스템 + 알림 + 로그인 추적

-- 1. users 테이블에 로그인 추적 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_streak INT NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_login_days INT NOT NULL DEFAULT 0;

-- 2. achievements 테이블 (업적 정의)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('all', 'job_seeker', 'hr_manager', 'headhunter')),
  grade TEXT NOT NULL CHECK (grade IN ('bronze', 'silver', 'gold', 'platinum')),
  condition_type TEXT NOT NULL,
  condition_value INT NOT NULL DEFAULT 1,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);

-- 3. user_achievements 테이블 (달성 기록)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_displayed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "System can insert achievements" ON user_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own display" ON user_achievements FOR UPDATE USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_displayed ON user_achievements(user_id, is_displayed) WHERE is_displayed = true;

-- 4. achievement_progress 테이블 (진행도)
CREATE TABLE IF NOT EXISTS achievement_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  current_value INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE achievement_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON achievement_progress FOR SELECT USING (true);
CREATE POLICY "System can manage progress" ON achievement_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update progress" ON achievement_progress FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_achievement_progress_user ON achievement_progress(user_id);

-- 5. notifications 테이블
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- 6. 업적 시드 데이터

-- 공통 업적
INSERT INTO achievements (code, name, description, category, target_type, grade, condition_type, condition_value, icon) VALUES
  ('first_login', '첫 방문', '첫 로그인을 했습니다.', '활동', 'all', 'bronze', 'login', 1, 'door'),
  ('login_7days', '꾸준한 방문자', '7일 연속 로그인했습니다.', '활동', 'all', 'silver', 'login_streak', 7, 'calendar'),
  ('login_30days', '헌신적 멤버', '30일 연속 로그인했습니다.', '활동', 'all', 'gold', 'login_streak', 30, 'fire'),
  ('login_365days', '올해의 멤버', '365일 누적 로그인했습니다.', '활동', 'all', 'platinum', 'total_login', 365, 'crown'),
  ('profile_complete', '프로필 완성', '프로필을 100% 입력했습니다.', '프로필', 'all', 'bronze', 'profile', 1, 'user'),
  ('verified_user', '인증 완료', '본인 인증을 완료했습니다.', '프로필', 'all', 'silver', 'verified', 1, 'shield'),
  ('invite_3', '홍보대사', '초대로 가입한 친구 3명', '소셜', 'all', 'gold', 'invite', 3, 'megaphone')
ON CONFLICT (code) DO NOTHING;

-- 구직자 업적
INSERT INTO achievements (code, name, description, category, target_type, grade, condition_type, condition_value, icon) VALUES
  ('first_review', '첫 발걸음', '첫 번째 리뷰를 작성했습니다.', '리뷰', 'job_seeker', 'bronze', 'review_count', 1, 'pencil'),
  ('review_5', '리뷰 기여자', '리뷰 5개를 작성했습니다.', '리뷰', 'job_seeker', 'silver', 'review_count', 5, 'pencil'),
  ('review_10', '리뷰 전문가', '리뷰 10개를 작성했습니다.', '리뷰', 'job_seeker', 'gold', 'review_count', 10, 'star'),
  ('review_30', '리뷰 마스터', '리뷰 30개를 작성했습니다.', '리뷰', 'job_seeker', 'platinum', 'review_count', 30, 'trophy'),
  ('verified_review_1', '증빙 제출', '증빙 리뷰 1개를 작성했습니다.', '리뷰', 'job_seeker', 'bronze', 'verified_review', 1, 'check'),
  ('verified_review_5', '신뢰 기여자', '증빙 리뷰 5개를 작성했습니다.', '리뷰', 'job_seeker', 'gold', 'verified_review', 5, 'check-double'),
  ('quality_review', '상세 리뷰어', '200자 이상 리뷰 5개를 작성했습니다.', '리뷰', 'job_seeker', 'silver', 'quality_review', 5, 'document'),
  ('helpful_review', '인정받는 리뷰어', '내 리뷰 좋아요 20개를 받았습니다.', '리뷰', 'job_seeker', 'gold', 'review_likes', 20, 'heart'),
  ('first_reviewer', '첫 리뷰어', '리뷰 0인 헤드헌터의 첫 리뷰를 작성했습니다.', '리뷰', 'job_seeker', 'silver', 'first_reviewer', 1, 'flag'),
  ('multi_firm', '멀티 서치펌', '5곳 이상 서치펌을 리뷰했습니다.', '리뷰', 'job_seeker', 'silver', 'multi_firm', 5, 'building'),
  ('community_post', '첫 게시글', '커뮤니티에 첫 게시글을 작성했습니다.', '커뮤니티', 'job_seeker', 'bronze', 'community_post', 1, 'message'),
  ('community_comment_20', '소통왕', '댓글 20개를 작성했습니다.', '커뮤니티', 'job_seeker', 'silver', 'community_comment', 20, 'chat'),
  ('community_likes_50', '인기 게시자', '좋아요 50개를 받았습니다.', '커뮤니티', 'job_seeker', 'gold', 'community_likes', 50, 'thumbsup')
ON CONFLICT (code) DO NOTHING;

-- HR담당자 업적
INSERT INTO achievements (code, name, description, category, target_type, grade, condition_type, condition_value, icon) VALUES
  ('hr_first_review', '채용 리뷰어', '첫 번째 리뷰를 작성했습니다.', '리뷰', 'hr_manager', 'bronze', 'review_count', 1, 'pencil'),
  ('hr_review_5', '채용 전문가', '리뷰 5개를 작성했습니다.', '리뷰', 'hr_manager', 'silver', 'review_count', 5, 'star'),
  ('hr_review_10', '채용 마스터', '리뷰 10개를 작성했습니다.', '리뷰', 'hr_manager', 'gold', 'review_count', 10, 'trophy'),
  ('hr_multi_firm', '멀티 서치펌', '서치펌 3곳 이상을 리뷰했습니다.', '리뷰', 'hr_manager', 'silver', 'multi_firm', 3, 'building'),
  ('hr_multi_industry', '업계 인사이더', '산업군 3개 이상을 리뷰했습니다.', '리뷰', 'hr_manager', 'gold', 'multi_industry', 3, 'globe'),
  ('hr_community_5', '채용 인사이트', '커뮤니티에 글 5개를 작성했습니다.', '커뮤니티', 'hr_manager', 'silver', 'community_post', 5, 'message'),
  ('hr_likes_100', '업계 리더', '좋아요 100개를 받았습니다.', '커뮤니티', 'hr_manager', 'platinum', 'community_likes', 100, 'crown')
ON CONFLICT (code) DO NOTHING;

-- 헤드헌터 업적
INSERT INTO achievements (code, name, description, category, target_type, grade, condition_type, condition_value, icon) VALUES
  ('hh_rating_4', '신뢰의 파트너', '평점 4.0 이상 (리뷰 5개 이상)', '평판', 'headhunter', 'bronze', 'hh_rating', 40, 'thumbsup'),
  ('hh_rating_4_5', '검증된 전문가', '평점 4.5 이상 (리뷰 10개 이상)', '평판', 'headhunter', 'silver', 'hh_rating_high', 45, 'star'),
  ('hh_top_10', '탑 헤드헌터', '상위 10%에 진입했습니다.', '평판', 'headhunter', 'gold', 'hh_top', 10, 'medal'),
  ('hh_top_5', '업계 레전드', '상위 5%를 3개월 유지했습니다.', '평판', 'headhunter', 'platinum', 'hh_top_sustained', 5, 'crown'),
  ('hh_reply_5', '소통하는 헤드헌터', '리뷰 답글 5개를 작성했습니다.', '활동', 'headhunter', 'bronze', 'hh_reply', 5, 'reply'),
  ('hh_reply_20', '적극적 헤드헌터', '리뷰 답글 20개를 작성했습니다.', '활동', 'headhunter', 'silver', 'hh_reply', 20, 'reply'),
  ('hh_position_1', '포지션 오픈', '포지션 1개를 등록했습니다.', '활동', 'headhunter', 'bronze', 'hh_position', 1, 'briefcase'),
  ('hh_position_10', '포지션 마스터', '포지션 10개를 등록했습니다.', '활동', 'headhunter', 'gold', 'hh_position', 10, 'briefcase'),
  ('hh_community_5', '업계 공유자', '커뮤니티에 글 5개를 작성했습니다.', '커뮤니티', 'headhunter', 'silver', 'community_post', 5, 'message')
ON CONFLICT (code) DO NOTHING;
