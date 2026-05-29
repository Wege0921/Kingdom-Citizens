-- Run this in Supabase Dashboard > SQL Editor AFTER uploading audio files
--
-- HOW TO ADD FALLBACK MUSIC:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a bucket called "radio-music" (set to public)
-- 3. Upload MP3 files into the bucket
-- 4. Click each file > "Get URL" > copy the public URL
-- 5. Paste the URLs below in the INSERT statements
-- 6. Run this SQL

-- Clear any existing sample tracks first (optional)
-- delete from public.radio_fallback_tracks;

insert into public.radio_fallback_tracks (title_en, title_am, artist, audio_url, duration_sec, order_index, is_active)
values
  -- Replace the URLs below with your actual Supabase Storage public URLs
  ('Lili V5', 'ሊሊ', 'Lil v5', 'https://wyuzezzhsqcjqpgjndro.supabase.co/storage/v1/object/public/radio-music/Lili%20v5%20Track%20No13.mp3', 180, 1, true),
  ('Bethelhem Tezera', 'ቤተልሔም ተዘራ', 'Bethelhem Tezera v1', 'https://wyuzezzhsqcjqpgjndro.supabase.co/storage/v1/object/public/radio-music/BETHLHME%20TEZERA%201%20-%20Track%2012.mp3', 240, 2, true),
  ('Meheret Etefa', 'ምህረት ኢተፋ መዝሙር', 'Meheret Etefa', 'https://wyuzezzhsqcjqpgjndro.supabase.co/storage/v1/object/public/radio-music/Meheret%20Etefa%2011%20-%20Track%2011.mp3', 300, 3, true)

on conflict do nothing;

-- Verify the tracks were inserted
select * from public.radio_fallback_tracks;
