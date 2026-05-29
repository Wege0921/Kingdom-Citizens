-- Update all sermon dates — Keys of the Kingdom first, Prayer Protocol last (this week)
-- Run in Supabase Dashboard -> SQL Editor

update public.sermons
set published_at = '2026-03-28 09:00:00+00'::timestamptz,
    created_at   = '2026-03-28 09:00:00+00'::timestamptz,
    updated_at   = '2026-03-28 09:00:00+00'::timestamptz
where title_en = 'Keys of the Kingdom: Forgiveness & Trust';

update public.sermons
set published_at = '2026-04-04 09:00:00+00'::timestamptz,
    created_at   = '2026-04-04 09:00:00+00'::timestamptz,
    updated_at   = '2026-04-04 09:00:00+00'::timestamptz
where title_en = 'John 3:3 and Beyond';

update public.sermons
set published_at = '2026-04-11 09:00:00+00'::timestamptz,
    created_at   = '2026-04-11 09:00:00+00'::timestamptz,
    updated_at   = '2026-04-11 09:00:00+00'::timestamptz
where title_en = 'Seeing, Entering, and Inheriting the Kingdom of God';

update public.sermons
set published_at = '2026-04-18 09:00:00+00'::timestamptz,
    created_at   = '2026-04-18 09:00:00+00'::timestamptz,
    updated_at   = '2026-04-18 09:00:00+00'::timestamptz
where title_en = 'The Third Key of the Kingdom – Faith';

update public.sermons
set published_at = '2026-04-25 09:00:00+00'::timestamptz,
    created_at   = '2026-04-25 09:00:00+00'::timestamptz,
    updated_at   = '2026-04-25 09:00:00+00'::timestamptz
where title_en = 'The Object and Benefits of Faith';

update public.sermons
set published_at = '2026-05-02 09:00:00+00'::timestamptz,
    created_at   = '2026-05-02 09:00:00+00'::timestamptz,
    updated_at   = '2026-05-02 09:00:00+00'::timestamptz
where title_en = 'Doubt – The Enemy of Faith';

update public.sermons
set published_at = '2026-05-09 09:00:00+00'::timestamptz,
    created_at   = '2026-05-09 09:00:00+00'::timestamptz,
    updated_at   = '2026-05-09 09:00:00+00'::timestamptz
where title_en = 'The Power of the Tongue';

update public.sermons
set published_at = '2026-05-16 09:00:00+00'::timestamptz,
    created_at   = '2026-05-16 09:00:00+00'::timestamptz,
    updated_at   = '2026-05-16 09:00:00+00'::timestamptz
where title_en = 'Prayer – A Key of the Kingdom';

-- Prayer Protocol = last / "this week"
update public.sermons
set published_at = '2026-05-30 09:00:00+00'::timestamptz,
    created_at   = '2026-05-30 09:00:00+00'::timestamptz,
    updated_at   = '2026-05-30 09:00:00+00'::timestamptz
where title_en = 'The Prayer Protocol in the Court of Heaven';

-- Verify results
select title_en, published_at::date as published_date
from public.sermons
order by published_at;
