-- 011: 커뮤니티 + 닉네임

-- 1. users 테이블에 nickname 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname) WHERE nickname IS NOT NULL;

-- 2. 커뮤니티 타입 ENUM
DO $$ BEGIN
  CREATE TYPE community_type AS ENUM ('job_seeker', 'hr_manager', 'headhunter');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. community_posts 테이블
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_type community_type NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  job_function TEXT,
  career_level TEXT,
  view_count INT NOT NULL DEFAULT 0,
  like_count INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts" ON community_posts
  FOR SELECT USING (NOT is_deleted);

CREATE POLICY "Authenticated users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(community_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(community_type, category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_id);

-- 4. community_comments 테이블
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  like_count INT NOT NULL DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON community_comments
  FOR SELECT USING (NOT is_deleted);

CREATE POLICY "Authenticated users can create comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own comments" ON community_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author ON community_comments(author_id);

-- 5. community_likes 테이블
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(target_type, target_id, user_id)
);

ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON community_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" ON community_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike" ON community_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_community_likes_target ON community_likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user ON community_likes(user_id);

-- 6. community_waitlist 테이블
CREATE TABLE IF NOT EXISTS community_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE community_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to waitlist" ON community_waitlist
  FOR INSERT WITH CHECK (true);
