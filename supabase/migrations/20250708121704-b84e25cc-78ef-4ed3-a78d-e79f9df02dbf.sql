-- Add view tracking table for schools and teachers
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  profile_type VARCHAR(20) NOT NULL CHECK (profile_type IN ('school', 'teacher')),
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  view_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_timestamp ON profile_views(view_timestamp);
CREATE INDEX IF NOT EXISTS idx_profile_views_type ON profile_views(profile_type);

-- Enable RLS
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Create policies for profile views
CREATE POLICY "Anyone can insert profile views" 
ON profile_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view profile view stats" 
ON profile_views 
FOR SELECT 
USING (true);

-- Add view count columns to school and teacher profiles for caching
ALTER TABLE school_profiles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_profile_views(
  profile_id_param UUID,
  profile_type_param VARCHAR(20),
  viewer_id_param UUID DEFAULT NULL,
  ip_address_param INET DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Insert view record
  INSERT INTO profile_views (profile_id, profile_type, viewer_id, ip_address, user_agent)
  VALUES (profile_id_param, profile_type_param, viewer_id_param, ip_address_param, user_agent_param);
  
  -- Update cached count
  IF profile_type_param = 'school' THEN
    UPDATE school_profiles 
    SET view_count = COALESCE(view_count, 0) + 1 
    WHERE id = profile_id_param;
  ELSIF profile_type_param = 'teacher' THEN
    UPDATE teacher_profiles 
    SET view_count = COALESCE(view_count, 0) + 1 
    WHERE id = profile_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;