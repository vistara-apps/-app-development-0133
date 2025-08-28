-- ResilientFlow Database Schema
-- Run this in your Supabase SQL editor to set up all tables

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'premium', 'enterprise')),
  onboarding_completed BOOLEAN DEFAULT false,
  privacy_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Entries Table
CREATE TABLE daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  emotional_state TEXT NOT NULL CHECK (emotional_state IN ('positive', 'neutral', 'negative')),
  primary_emotion TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  notes TEXT,
  mood_triggers TEXT[],
  sleep_hours DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Activities Master Table
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Social', 'Mindfulness', 'Journaling')),
  type TEXT NOT NULL,
  guide_content TEXT NOT NULL,
  target_emotion TEXT,
  score INTEGER DEFAULT 15,
  estimated_duration_minutes INTEGER DEFAULT 5,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  activity_id UUID REFERENCES activities(id) NOT NULL,
  completion_date DATE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Circles Table
CREATE TABLE support_circles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  member_limit INTEGER DEFAULT 10,
  prompt_of_the_day TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Circle Members Table
CREATE TABLE circle_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  circle_id UUID REFERENCES support_circles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  privacy_settings JSONB DEFAULT '{"shareEmotionalState": true, "shareActivityData": true}',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, circle_id)
);

-- Circle Messages Table
CREATE TABLE circle_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID REFERENCES support_circles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'activity_share', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Insights Table
CREATE TABLE ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('pattern', 'recommendation', 'observation')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
  suggestions TEXT[],
  data_sources JSONB,
  viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'paused')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  payment_method TEXT CHECK (payment_method IN ('stripe', 'base-x402')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Reports Table
CREATE TABLE weekly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  emotional_summary JSONB,
  activity_summary JSONB,
  insights JSONB,
  recommendations TEXT[],
  viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Indexes for better performance
CREATE INDEX idx_daily_entries_user_date ON daily_entries(user_id, date);
CREATE INDEX idx_activity_logs_user_date ON activity_logs(user_id, completion_date);
CREATE INDEX idx_circle_messages_circle_time ON circle_messages(circle_id, created_at);
CREATE INDEX idx_ai_insights_user_time ON ai_insights(user_id, created_at);
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Row Level Security Policies

-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Entries
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own entries" ON daily_entries FOR ALL USING (auth.uid() = user_id);

-- Activity Logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own activity logs" ON activity_logs FOR ALL USING (auth.uid() = user_id);

-- Activities (Public read, admin write)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view activities" ON activities FOR SELECT TO authenticated USING (true);

-- Support Circles
ALTER TABLE support_circles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public circles" ON support_circles FOR SELECT TO authenticated USING (NOT is_private OR created_by = auth.uid());
CREATE POLICY "Users can create circles" ON support_circles FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Circle creators can update" ON support_circles FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Circle Members
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view circle membership" ON circle_members FOR SELECT TO authenticated 
  USING (user_id = auth.uid() OR circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can join/leave circles" ON circle_members FOR ALL TO authenticated USING (user_id = auth.uid());

-- Circle Messages
ALTER TABLE circle_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Circle members can view messages" ON circle_messages FOR SELECT TO authenticated 
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid()));
CREATE POLICY "Circle members can send messages" ON circle_messages FOR INSERT TO authenticated 
  WITH CHECK (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid()) AND user_id = auth.uid());

-- AI Insights
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own insights" ON ai_insights FOR ALL USING (auth.uid() = user_id);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage subscriptions" ON subscriptions FOR ALL USING (true); -- For webhook updates

-- Weekly Reports
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reports" ON weekly_reports FOR ALL USING (auth.uid() = user_id);

-- Functions for common operations

-- Function to get user's activity streak
CREATE OR REPLACE FUNCTION get_activity_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  check_date DATE := CURRENT_DATE;
BEGIN
  LOOP
    IF EXISTS (
      SELECT 1 FROM activity_logs 
      WHERE user_id = p_user_id 
      AND completion_date = check_date
    ) THEN
      streak_count := streak_count + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate emotional score
CREATE OR REPLACE FUNCTION calculate_emotional_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  activity_score INTEGER := 0;
  consistency_bonus INTEGER := 0;
  emotional_bonus INTEGER := 0;
  streak_count INTEGER;
  positive_days INTEGER;
BEGIN
  -- Activity score (last 7 days)
  SELECT COALESCE(SUM(a.score), 0) INTO activity_score
  FROM activity_logs al
  JOIN activities a ON al.activity_id = a.id
  WHERE al.user_id = p_user_id
  AND al.completion_date >= CURRENT_DATE - INTERVAL '7 days';
  
  -- Consistency bonus
  SELECT get_activity_streak(p_user_id) INTO streak_count;
  consistency_bonus := LEAST(streak_count * 2, 50);
  
  -- Emotional bonus
  SELECT COUNT(*) INTO positive_days
  FROM daily_entries
  WHERE user_id = p_user_id
  AND date >= CURRENT_DATE - INTERVAL '7 days'
  AND emotional_state = 'positive';
  
  emotional_bonus := positive_days * 5;
  
  RETURN activity_score + consistency_bonus + emotional_bonus;
END;
$$ LANGUAGE plpgsql;

-- Insert default activities
INSERT INTO activities (name, description, category, type, guide_content, target_emotion, score) VALUES
-- Mindfulness Category
('Mindful Breathing', 'A 5-minute guided breathing exercise to center yourself', 'Mindfulness', 'mindfulness', 'Find a comfortable position. Close your eyes and focus on your breath. Breathe in slowly for 4 counts, hold for 4 counts, then exhale for 6 counts. Continue this pattern for 5 minutes, bringing your attention back to your breath whenever your mind wanders.', 'calm', 15),
('Me Time', 'Dedicated time for personal reflection and self-care', 'Mindfulness', 'mindfulness', 'Take 30 minutes for yourself. Read a book, take a warm bath, meditate, listen to music, or do something that brings you joy. The key is to be fully present and focus on yourself without distractions.', 'refreshed', 25),
('Learning', 'Engage in learning something new or developing a skill', 'Mindfulness', 'mindfulness', 'Choose a topic that interests you. Read an article, watch an educational video, practice a new skill, or take an online course for 20-30 minutes. Focus on the process of learning rather than the outcome.', 'accomplished', 15),
('Cooking', 'Prepare a healthy, mindful meal with intention', 'Mindfulness', 'mindfulness', 'Choose a recipe you enjoy. Focus on each step - the textures, smells, colors of ingredients. Cook slowly and mindfully, appreciating the process of creating something nourishing for yourself.', 'satisfied', 15),
('Progressive Muscle Relaxation', 'Release physical tension through systematic muscle relaxation', 'Mindfulness', 'mindfulness', 'Starting with your toes, tense each muscle group for 5 seconds, then release. Work your way up through your legs, torso, arms, and face. Notice the contrast between tension and relaxation.', 'relaxed', 15),

-- Social Category
('Social Meetup', 'Connect with friends or community members in person', 'Social', 'social', 'Meet with friends, join a community group, or attend a social event. Focus on genuine connection - put away devices and engage in meaningful conversation. Listen actively and share authentically.', 'connected', 30),
('Family Time', 'Spend quality time connecting with family members', 'Social', 'social', 'Engage in meaningful conversation, play games, share a meal, or do an activity together without distractions. Focus on being present and creating positive memories together.', 'connected', 30),
('Work Out', 'Physical exercise to boost mood and energy levels', 'Social', 'social', 'Choose any form of exercise you enjoy - yoga, running, strength training, dancing, or sports. Can be done alone or with others. Aim for 20-30 minutes and focus on how movement makes you feel.', 'energetic', 20),
('Nature Walk', 'Take a peaceful walk in nature to reconnect and recharge', 'Social', 'social', 'Find a nearby park, trail, or green space. Walk mindfully, observing the sights, sounds, and smells around you. Leave devices behind or use them minimally. Appreciate the natural world.', 'energized', 20),

-- Journaling Category
('Gratitude Journal', 'Write down three things you are grateful for today', 'Journaling', 'journaling', 'Think about your day and identify three things, big or small, that you are grateful for. Write them down with detail about why each one matters to you. Reflect on the positive aspects of your life.', 'positive', 25),
('Cognitive Reframing', 'Challenge negative thoughts with a more balanced perspective', 'Journaling', 'journaling', 'Identify a negative thought or worry. Write it down, then ask yourself: Is this thought helpful? What evidence supports or contradicts it? What would you tell a friend in this situation? Write a more balanced perspective.', 'balanced', 20);

-- Create trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON support_circles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();