-- Create schema for ResilientFlow app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  guide_content TEXT,
  target_emotion TEXT,
  premium_only BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Daily entries table
CREATE TABLE IF NOT EXISTS public.daily_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  date DATE NOT NULL,
  emotional_state TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  activity_id UUID REFERENCES public.activities(id) NOT NULL,
  completion_date DATE NOT NULL,
  rating INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_id ON public.daily_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON public.daily_entries(date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_id ON public.activity_logs(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_completion_date ON public.activity_logs(completion_date);

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only read and update their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Activities are readable by all authenticated users
CREATE POLICY "Activities are viewable by all authenticated users" ON public.activities
  FOR SELECT USING (auth.role() = 'authenticated');

-- Daily entries are only accessible by the user who created them
CREATE POLICY "Users can CRUD own daily entries" ON public.daily_entries
  FOR ALL USING (auth.uid() = user_id);

-- Activity logs are only accessible by the user who created them
CREATE POLICY "Users can CRUD own activity logs" ON public.activity_logs
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON public.daily_entries
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_activity_logs_updated_at
  BEFORE UPDATE ON public.activity_logs
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Insert some default activities
INSERT INTO public.activities (name, description, type, guide_content, target_emotion)
VALUES
  ('Mindful Breathing', 'A 5-minute guided breathing exercise to center yourself', 'mindfulness', 'Find a comfortable position. Close your eyes and focus on your breath...', 'calm'),
  ('Gratitude Journal', 'Write down three things you''re grateful for today', 'gratitude', 'Think about your day and identify three things, big or small, that you''re grateful for...', 'positive'),
  ('Cognitive Reframing', 'Challenge negative thoughts with a more balanced perspective', 'cognitive', 'Identify a negative thought. Ask yourself: Is this thought helpful? What evidence supports or contradicts it?', 'balanced'),
  ('Progressive Muscle Relaxation', 'Release physical tension through systematic muscle relaxation', 'relaxation', 'Starting with your toes, tense each muscle group for 5 seconds, then release...', 'relaxed')
ON CONFLICT DO NOTHING;

