-- Run this in Supabase Dashboard > SQL Editor to remove ALL fallback tracks
-- Then run add-fallback-tracks.sql again with only your real songs

delete from public.radio_fallback_tracks;

-- Verify the table is empty
select * from public.radio_fallback_tracks;
