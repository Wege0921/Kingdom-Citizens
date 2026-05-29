-- Atomic sermon view-count increment.
-- Replaces the read-modify-write pattern in /api/sermons/[id]/view which
-- loses increments under concurrent requests.
--
-- Run this in the Supabase SQL editor (or via your migration pipeline).

create or replace function public.increment_sermon_view(sermon_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.sermons
  set view_count = coalesce(view_count, 0) + 1
  where id = sermon_id;
$$;

-- Allow the function to be called by the service role (used by the API route).
grant execute on function public.increment_sermon_view(uuid) to service_role;
