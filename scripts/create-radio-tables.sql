-- Run this in Supabase Dashboard > SQL Editor
-- Creates all tables needed for the Radio feature

-- ---------------------------------------------------------------------------
-- Radio Sessions (live broadcasts)
-- ---------------------------------------------------------------------------
create table if not exists public.radio_sessions (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_am text,
  description_en text,
  description_am text,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'ended')),
  host_id uuid not null references auth.users (id) on delete cascade,
  started_at timestamptz,
  ended_at timestamptz,
  listener_count integer not null default 0,
  peak_listeners integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Fallback Tracks (music played when no live session is active)
-- ---------------------------------------------------------------------------
create table if not exists public.radio_fallback_tracks (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_am text,
  artist text,
  audio_url text not null,
  duration_sec integer,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Radio Chat Messages
-- ---------------------------------------------------------------------------
create table if not exists public.radio_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.radio_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Radio Reactions
-- ---------------------------------------------------------------------------
create table if not exists public.radio_reactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.radio_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Radio Song Requests
-- ---------------------------------------------------------------------------
create table if not exists public.radio_song_requests (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.radio_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  artist text not null,
  title text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'skipped')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Radio Polls
-- ---------------------------------------------------------------------------
create table if not exists public.radio_polls (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.radio_sessions (id) on delete cascade,
  question_en text not null,
  question_am text,
  options jsonb not null default '[]',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.radio_sessions enable row level security;
alter table public.radio_fallback_tracks enable row level security;
alter table public.radio_chat_messages enable row level security;
alter table public.radio_reactions enable row level security;
alter table public.radio_song_requests enable row level security;
alter table public.radio_polls enable row level security;

-- Radio sessions: anyone can read live/ended, host can manage their own
drop policy if exists "radio_sessions_read" on public.radio_sessions;
create policy "radio_sessions_read" on public.radio_sessions for select using (true);

drop policy if exists "radio_sessions_host_manage" on public.radio_sessions;
create policy "radio_sessions_host_manage" on public.radio_sessions
  for all using (auth.uid() = host_id) with check (auth.uid() = host_id);

-- Fallback tracks: anyone can read, admin can manage
drop policy if exists "radio_fallback_tracks_read" on public.radio_fallback_tracks;
create policy "radio_fallback_tracks_read" on public.radio_fallback_tracks for select using (is_active = true);

drop policy if exists "radio_fallback_tracks_admin" on public.radio_fallback_tracks;
create policy "radio_fallback_tracks_admin" on public.radio_fallback_tracks
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN', 'LEADER')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN', 'LEADER')));

-- Chat messages: anyone in session can read, own insert
drop policy if exists "radio_chat_read" on public.radio_chat_messages;
create policy "radio_chat_read" on public.radio_chat_messages for select using (true);

drop policy if exists "radio_chat_insert_own" on public.radio_chat_messages;
create policy "radio_chat_insert_own" on public.radio_chat_messages
  for insert with check (auth.uid() = user_id);

-- Reactions: anyone can read, own insert
drop policy if exists "radio_reactions_read" on public.radio_reactions;
create policy "radio_reactions_read" on public.radio_reactions for select using (true);

drop policy if exists "radio_reactions_insert_own" on public.radio_reactions;
create policy "radio_reactions_insert_own" on public.radio_reactions
  for insert with check (auth.uid() = user_id);

-- Song requests: anyone in session can read, own insert
drop policy if exists "radio_requests_read" on public.radio_song_requests;
create policy "radio_requests_read" on public.radio_song_requests for select using (true);

drop policy if exists "radio_requests_insert_own" on public.radio_song_requests;
create policy "radio_requests_insert_own" on public.radio_song_requests
  for insert with check (auth.uid() = user_id);

-- Polls: anyone can read, host can manage
drop policy if exists "radio_polls_read" on public.radio_polls;
create policy "radio_polls_read" on public.radio_polls for select using (true);

drop policy if exists "radio_polls_host" on public.radio_polls;
create policy "radio_polls_host" on public.radio_polls
  for all using (
    exists (
      select 1 from public.radio_sessions rs
      where rs.id = session_id and rs.host_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.radio_sessions rs
      where rs.id = session_id and rs.host_id = auth.uid()
    )
  );

SELECT 'Radio tables and RLS policies created!' as status;
