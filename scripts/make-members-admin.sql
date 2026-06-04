-- Make members admin in Supabase
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run

-- ============================================
-- OPTION 1: Promote a specific user by email
-- (Replace 'user@example.com' with the actual email)
-- ============================================

update public.profiles
set role = 'ADMIN',
    updated_at = now()
where id = (
  select id
  from auth.users
  where email = 'user@example.com'
);

-- ============================================
-- OPTION 2: Promote multiple users by email
-- ============================================

-- update public.profiles
-- set role = 'ADMIN',
--     updated_at = now()
-- where id in (
--   select id
--   from auth.users
--   where email in (
--     'user1@example.com',
--     'user2@example.com',
--     'user3@example.com'
--   )
-- );

-- ============================================
-- OPTION 3: Promote a user by their UUID
-- (Use the user's profile ID directly)
-- ============================================

-- update public.profiles
-- set role = 'ADMIN',
--     updated_at = now()
-- where id = '00000000-0000-0000-0000-000000000000';

-- ============================================
-- OPTION 4: List all members to find their emails/IDs
-- ============================================

-- select
--   p.id,
--   u.email,
--   p.full_name,
--   p.role,
--   p.created_at
-- from public.profiles p
-- join auth.users u on u.id = p.id
-- where p.role = 'MEMBER'
-- order by p.created_at desc;

-- ============================================
-- OPTION 5: List all admins to verify
-- ============================================

-- select
--   p.id,
--   u.email,
--   p.full_name,
--   p.role,
--   p.created_at
-- from public.profiles p
-- join auth.users u on u.id = p.id
-- where p.role = 'ADMIN'
-- order by p.created_at desc;

-- ============================================
-- Verification: Check the user was promoted
-- ============================================

select
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.updated_at
from public.profiles p
join auth.users u on u.id = p.id
where u.email = 'user@example.com';
