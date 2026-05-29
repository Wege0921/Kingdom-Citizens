-- Publish the "Seeing, Entering, and Inheriting the Kingdom of God" bilingual sermon
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run

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
  'Seeing, Entering, and Inheriting the Kingdom of God',
  'የእግዚአብሔርን መንግሥት ማየት፣ መግባት እና መውረስ',

  -- English summary
  E'<h2>Today’s Meeting Summary</h2>\n\n'
  '<h3>Topic: Seeing, Entering, and Inheriting the Kingdom of God</h3>\n\n'
  'Praise God for a powerful and fruitful time together! 🙌\n\n'
  'Today we went deep into the heart of the Kingdom:\n\n'
  '<strong>1. Seeing the Kingdom (John 3:3)</strong>\n'
  'Only those who are born again can perceive and experience God’s rule. '
  'The Holy Spirit opens our spiritual eyes.\n\n'
  '<strong>2. Entering the Kingdom (John 3:5)</strong>\n'
  'It happens through the new birth of water and the Spirit (Ezekiel 36:25–27). '
  'We enter by grace, not by works.\n\n'
  '<strong>3. Childlike faith</strong>\n'
  '(Matthew 18:3; Mark 10:15; Luke 18:15–17) – We must turn and receive the Kingdom like little children: '
  'humble, dependent, trusting, with empty hands.\n\n'
  '<strong>4. Paul’s teaching</strong>\n'
  'We have already been brought into the Kingdom (Colossians 1:13). '
  'It is righteousness, peace and joy in the Holy Spirit (Romans 14:17).\n\n'
  'We must live worthy so we do not miss the full inheritance '
  '(1 Corinthians 6:9–11; Galatians 5:21; Ephesians 5:5).\n\n'
  'The discussion afterwards was rich and honest — thank you for sharing your hearts! '
  'Many of us were reminded that the Kingdom is already here through the new birth, '
  'yet we are still pressing on to fully inherit.',

  -- Amharic summary
  E'<h2>የዛሬው ትምህርት ማስታወሻ</h2>\n\n'
  '<h3>ርዕስ፡ የእግዚአብሔርን መንግሥት ማየት፣ መግባት እና መውረስ</h3>\n\n'
  'ፍሬያማ ጊዜ እና ጥልቅ የሆነ ውይይት አካሄደናል፤ እግዚአብሔር ይመስገን! 🙌\n\n'
  '<strong>1. መንግሥቱን ማየት (ዮሐንስ 3፡3)</strong>\n'
  'ዳግመኛ የተወለዱት ብቻ የእግዚአብሔርን አገዛዝ ሊያስተውሉ እና ሊለማመዱ ይችላሉ። '
  'መንፈስ ቅዱስ መንፈሳዊ ዓይኖቻችንን በመክፈት መንግሥቱን እንድንረዳ ያግዘናል።\n\n'
  '<strong>2. ወደ መንግሥቱ መግባት (ዮሐንስ 3፡5)</strong>\n'
  'የሚሆነው ከመንፈስ እና ከውሃ በመወለድ ነው (ሕዝቅኤል 36፡25–27)። '
  'የምንገባው በሥራ ሳይሆን በጸጋ ነው።\n\n'
  '<strong>3. እንደ ልጅ ያለ እምነት</strong>\n'
  '(ማቴዎስ 18፡3፤ ማርቆስ 10፡15፤ ሉቃስ 18፡15–17) – '
  'እንደ ልጆች ባለ እምነት መንግሥቱን መቀበል አለብን፤ ልጆች በባሕሪያቸው ትሑት፣ ጥገኛ፣ በቀላሉ የሚያምኑ ናቸው።\n\n'
  '<strong>4. የጳውሎስ ትምህርት</strong>\n'
  'አስቀድመን ወደ መንግሥቱ ገብተናል (ቆላስይስ 1፡13)። '
  'በመንፈስ ቅዱስ የሚገኝ ጽድቅ፣ ሰላምና ደስታ ነው (ሮሜ 14፡17)።\n\n'
  'ወደ መንግሥቱ በሙላት ለመግባት እንደሚገባ መኖር አለብን '
  '(1ኛ ቆሮንቶስ 6፡9–11፤ ገላትያ 5፡21፤ ኤፌሶን 5፡5)።\n\n'
  'ከዚያ በኋላ የነበረው ውይይት ፍሬያማና ግልጽነት የተሞላበት ነበር — ልባችሁን ስላካፈላችሁን እናመሰግናለን! '
  'ብዙዎቻችን መንግሥቱ በአዲስ ልደት አማካኝነት እዚህ እንዳለ፣ ሆኖም ግን ሙሉ ርስት ላይ ለመድረስ አሁንም እየተጋን መሆናችን ተገንዝበናል።',

  -- scripture_references (JSONB)
  '[{"book": "John", "chapter": 3, "verses": "3"},
    {"book": "John", "chapter": 3, "verses": "5"},
    {"book": "Ezekiel", "chapter": 36, "verses": "25-27"},
    {"book": "Matthew", "chapter": 18, "verses": "3"},
    {"book": "Mark", "chapter": 10, "verses": "15"},
    {"book": "Luke", "chapter": 18, "verses": "15-17"},
    {"book": "Colossians", "chapter": 1, "verses": "13"},
    {"book": "Romans", "chapter": 14, "verses": "17"},
    {"book": "1 Corinthians", "chapter": 6, "verses": "9-11"},
    {"book": "Galatians", "chapter": 5, "verses": "21"},
    {"book": "Ephesians", "chapter": 5, "verses": "5"}]'::jsonb,

  null,   -- speaker_id
  null,   -- series_id
  null,   -- video_url

  -- placeholder thumbnail URL
  'https://res.cloudinary.com/demo/image/upload/v1652345762/sermons/placeholder.jpg',

  null,   -- audio_url
  null,   -- pdf_url

  -- memory_verse_en
  E'Jesus answered him, "Truly, truly, I say to you, unless one is born again he cannot see the kingdom of God."\n— John 3:3',

  -- memory_verse_am
  E'ኢየሱስ መልሶ። እውነት እውነት እላችኋለሁ፥ ሰው ከላይ ካልተወለደ ለእግዚአብሔር መንግሥት ሊያይ አይችልም እንደሆነ አሉት።\n— ዮሐንስ 3፡3',

  '[]'::jsonb,  -- prayer_points
  '[]'::jsonb,  -- discussion_questions

  true,                            -- is_published
  '2026-04-05 09:00:00+00'::timestamptz,  -- published_at
  0,                               -- view_count
  null,                            -- created_by (replace with your UUID if desired)
  '2026-04-05 09:00:00+00'::timestamptz,  -- created_at
  '2026-04-05 09:00:00+00'::timestamptz   -- updated_at
)
returning id, title_en, title_am, published_at;
