-- Run this in Supabase Dashboard > SQL Editor to verify learning progress setup

-- 1. Check user_module_progress table exists
SELECT 'user_module_progress table exists' as check, COUNT(*) > 0 as ok
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'user_module_progress';

-- 2. Check unique constraint on (user_id, module_id)
SELECT 'unique constraint on (user_id, module_id)' as check, COUNT(*) > 0 as ok
FROM information_schema.table_constraints 
WHERE table_name = 'user_module_progress' 
AND constraint_type = 'UNIQUE';

-- 3. Check RLS is enabled
SELECT 'RLS enabled' as check, relrowsecurity as ok
FROM pg_class 
WHERE relname = 'user_module_progress' AND relnamespace = 'public'::regnamespace;

-- 4. Check RLS policy exists
SELECT 'user_module_progress_own policy exists' as check, COUNT(*) > 0 as ok
FROM pg_policies 
WHERE tablename = 'user_module_progress' AND policyname = 'user_module_progress_own';

-- 5. Show any existing progress rows (run while logged in)
SELECT user_id, module_id, status, quiz_score, completed_at
FROM public.user_module_progress
LIMIT 10;

-- 6. Count total progress records
SELECT COUNT(*) as total_progress_records FROM public.user_module_progress;
