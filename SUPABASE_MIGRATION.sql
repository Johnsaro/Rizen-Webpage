-- Existing table: bug_bounty_submissions
-- Adding columns: assignee_id, sla_deadline, duplicate_of, resolution_summary

ALTER TABLE bug_bounty_submissions 
ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS duplicate_of UUID REFERENCES bug_bounty_submissions(id),
ADD COLUMN IF NOT EXISTS resolution_summary TEXT;

-- Create Internal Notes table
CREATE TABLE IF NOT EXISTS bug_internal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bug_id UUID NOT NULL REFERENCES bug_bounty_submissions(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Internal Notes
ALTER TABLE bug_internal_notes ENABLE ROW LEVEL SECURITY;

-- Only admins can see/modify internal notes (assuming admin_id/profile role check)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_access_notes') THEN
    CREATE POLICY admin_access_notes ON bug_internal_notes 
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() AND is_admin = true
      )
    );
  END IF;
END $$;

-- Create Timeline table
CREATE TABLE IF NOT EXISTS bug_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bug_id UUID NOT NULL REFERENCES bug_bounty_submissions(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    actor_id UUID NOT NULL REFERENCES auth.users(id),
    details_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Timeline
ALTER TABLE bug_timeline ENABLE ROW LEVEL SECURITY;

-- Only admins can see/modify timeline
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_access_timeline') THEN
    CREATE POLICY admin_access_timeline ON bug_timeline 
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() AND is_admin = true
      )
    );
  END IF;
END $$;
