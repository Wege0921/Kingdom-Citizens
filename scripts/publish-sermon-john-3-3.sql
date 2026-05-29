-- Publish the "John 3:3 and Beyond" bilingual sermon
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run

-- NOTE: Replace 'YOUR_USER_UUID' with your actual auth user UUID, or leave as NULL.
-- You can find it in Supabase Dashboard -> Authentication -> Users.

insert into public.sermons (
  title_en,
  title_am,
  summary_en,
  summary_am,
  scripture_references,
  speaker_id,
  series_id,
  video_url,
  video_thumbnail,
  audio_url,
  pdf_url,
  memory_verse_en,
  memory_verse_am,
  prayer_points,
  discussion_questions,
  is_published,
  published_at,
  view_count,
  created_by,
  created_at,
  updated_at
) values (
  'John 3:3 and Beyond — Seeing, Entering & Inheriting the Kingdom',
  'ዮሐንስ 3፡3 ባሉ ርዕሶች ላይ — መንግሥቱን ማየት፣ መግባት እና መውረስ',

  -- English summary
  E'To all Kingdom Family,\n\n'
  'Grace and peace to you all!\n'
  'Thank you for a powerful time together today as we explored the Kingdom of God. '
  'God is truly opening our eyes to His reign in our lives.\n\n'
  '<h3>Next week’s topic:</h3>\n'
  'John 3:3 and beyond – The Concept of\n'
  '1. Seeing the Kingdom\n'
  '2. Entering the Kingdom, and\n'
  '3. Inheriting the Kingdom of God\n\n'
  'We will dive deep into Jesus’ conversation with Nicodemus in John 3:3–8 '
  '(and related verses) and explore:\n\n'
  '• What it means to <strong>see</strong> the Kingdom of God (John 3:3)\n'
  '• What it means to <strong>enter</strong> the Kingdom of God '
  '(John 3:5 – born of water and the Spirit)\n'
  '• What it means to <strong>inherit</strong> the Kingdom of God '
  '(future reward, faithfulness, and the life to come)\n\n'
  'This will help us understand the difference between the free gift of salvation '
  '(entering) and the rewards of faithful living (inheriting), plus how the new birth changes everything.',

  -- Amharic summary
  E'ለመላው የመንግሥቱ ቤተሰብ፣\n\n'
  'ጸጋና ሰላም ለሁላችሁም ይሁን!\n\n'
  'ዛሬ የእግዚአብሔርን መንግሥት ስንቃኝ ለነበረን ጥሩ ጊዜ እናመሰግናለን። '
  'እግዚአብሔር በሕይወታችን ውስጥ ስላለው ጌትነት በቃሉ በእውነት ዓይኖቻችንን እየከፈተ ነው።\n\n'
  '<h3>የሚቀጥለው ሳምንት ርዕስ፡-</h3>\n'
  'ዮሐንስ 3፡3 ባሉ ርዕሶች ላይ - ይህም\n'
  '1. መንግሥቱን ማየት\n'
  '2. ወደ መንግሥቱ መግባት፣ እና\n'
  '3. የእግዚአብሔርን መንግሥት መውረስ\n\n'
  'ኢየሱስ ከኒቆዲሞስ ጋር በዮሐንስ 3፡3–8 '
  '(እና ተዛማጅ ጥቅሶች) ባደረገው ውይይት በጥልቀት እንመረምራለን እና የሚከተሉትን እንወያያለን፡- \n\n'
  '• የእግዚአብሔርን መንግሥት <strong>ማየት</strong> ምን ማለት ነው (ዮሐንስ 3፡3)\n'
  '• ወደ እግዚአብሔር መንግሥት <strong>መግባት</strong> ምን ማለት ነው '
  '(ዮሐንስ 3፡5 - ከውሃና ከመንፈስ መወለድ)\n'
  '• የእግዚአብሔርን መንግሥት <strong>መውረስ</strong> ምን ማለት ነው '
  '(የወደፊቱ ሽልማት፣ ታማኝነት እና የሚመጣውን ሕይወት)\n\n'
  'ይህም በነጻ የመዳን ስጦታ (መግባት) እና በታማኝ ኑሮ ሽልማቶች (መውረስ) መካከል ያለውን ልዩነት '
  'እንዲሁም አዲስ ልደት ሁሉንም ነገር እንዴት እንደሚለውጥ እንድንረዳ ይረዳናል።',

  -- scripture_references (JSONB)
  '[{"book": "John", "chapter": 3, "verses": "3-8"},
    {"book": "John", "chapter": 3, "verses": "3"},
    {"book": "John", "chapter": 3, "verses": "5"}]'::jsonb,

  null,   -- speaker_id (optional: set to a speaker UUID if you have one)
  null,   -- series_id  (optional: set to a series UUID if you have one)
  null,   -- video_url
  null,   -- video_thumbnail
  null,   -- audio_url
  null,   -- pdf_url

  -- memory_verse_en
  E'Jesus answered him, "Truly, truly, I say to you, unless one is born again he cannot see the kingdom of God."\n— John 3:3',

  -- memory_verse_am
  E'ኢየሱስ መልሶ። እውነት እውነት እላችኋለሁ፥ ሰው ከላይ ካልተወለደ ለእግዚአብሔር መንግሥት ሊያይ አይችልም እንደሆነ አሉት።\n— ዮሐንስ 3፡3',

  '[]'::jsonb,  -- prayer_points
  '[]'::jsonb,  -- discussion_questions

  true,                            -- is_published
  '2026-03-29 09:00:00+00'::timestamptz,  -- published_at
  0,                               -- view_count
  null,                            -- created_by (replace with your UUID if desired)
  '2026-03-29 09:00:00+00'::timestamptz,  -- created_at
  '2026-03-29 09:00:00+00'::timestamptz   -- updated_at
)
returning id, title_en, title_am, published_at;
