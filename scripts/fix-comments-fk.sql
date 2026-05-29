-- Fix: Add foreign key from comments.user_id to profiles.id
-- This allows Supabase's implicit join syntax: profile:profiles(...)
-- Run this in Supabase Dashboard > SQL Editor

-- First, add the FK constraint (safe to run multiple times thanks to IF NOT EXISTS pattern)
DO $$
BEGIN
  -- Check if constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'comments_user_id_profiles_fkey'
    AND table_name = 'comments'
  ) THEN
    ALTER TABLE public.comments 
    ADD CONSTRAINT comments_user_id_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id);
    
    RAISE NOTICE 'Added foreign key constraint comments_user_id_profiles_fkey';
  ELSE
    RAISE NOTICE 'Foreign key constraint already exists';
  END IF;
END $$;

-- Also ensure community_posts has the same FK for its profile join
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'community_posts_user_id_profiles_fkey'
    AND table_name = 'community_posts'
  ) THEN
    ALTER TABLE public.community_posts 
    ADD CONSTRAINT community_posts_user_id_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id);
    
    RAISE NOTICE 'Added foreign key constraint community_posts_user_id_profiles_fkey';
  ELSE
    RAISE NOTICE 'Foreign key constraint already exists';
  END IF;
END $$;

SELECT 'Foreign key constraints fixed!' as status;
