-- Run this in Supabase Dashboard > SQL Editor to diagnose posting issues

-- 1. Check if community_posts table exists
SELECT 'community_posts table exists' as check, COUNT(*) > 0 as ok
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'community_posts';

-- 2. Check if comments table exists
SELECT 'comments table exists' as check, COUNT(*) > 0 as ok
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'comments';

-- 3. Check RLS policies on community_posts
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'community_posts';

-- 4. Check RLS policies on comments
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'comments';

-- 5. Check if RLS is enabled on both tables
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname IN ('community_posts', 'comments') AND relnamespace = 'public'::regnamespace;

-- 6. Test insert as authenticated user (run while logged in to see if RLS blocks)
-- This will show any RLS errors
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get a test user ID (your own)
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    RAISE NOTICE 'Test user ID: %', test_user_id;
  ELSE
    RAISE NOTICE 'No users found in auth.users';
  END IF;
END $$;
