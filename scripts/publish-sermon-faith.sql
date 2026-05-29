-- Publish the "The Third Key of the Kingdom – Faith" bilingual sermon
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
  'The Third Key of the Kingdom – Faith',
  'ሦስተኛው የመንግሥተ ሰማይ ቁልፍ – እምነት',

  -- English summary (dollar-quoted for safe multi-line)
  $EN$
<h3>Kingdom Family – Today’s Meeting Summary</h3>

<strong>Topic: The Third Key of the Kingdom – Faith</strong>

Praise God for another powerful and fruitful time in His presence! 🙌

As usual, we continued our series on the Keys of the Kingdom – How to Live in This NOW Kingdom.

We first wrapped up last week’s teaching on the keys of Forgiveness and Not to Worry.
Today we moved to the third key: <strong>FAITH</strong>.

We began with the clear definition in Hebrews 11:1 –
"Now faith is confidence in what we hope for and assurance about what we do not see."

We then saw how faith comes according to Romans 10:17:
"So then faith comes by hearing, and hearing by the word of God."

We looked at examples of little faith and great faith in the Gospels:

• The Centurion in Matthew 8:5-13 who amazed Jesus with his great faith.
• The woman with the issue of blood in Matthew 9:20-22 who received healing through her personal faith.

We had rich discussion and powerful testimonies. One truth that stood out to everyone is this powerful picture:

Just as every earthly government has its own currency for transactions within its territory, the Kingdom of God also has its own spiritual currency — and that currency is called <strong>FAITH</strong>.

People with little money in the world are considered poor and struggle, while those with plenty are rich. In the same way, in the Kingdom of God:
• Those with little faith often struggle in life.
• Those with great faith can see and experience even miraculous things.

Faith is the hardest and most valuable currency in this world — it can “buy” anything in the Kingdom! That is why Jesus declared, "Everything is possible for one who believes" (Mark 9:23; see also Matthew 17:20).

Everyone expressed great joy and encouragement with today’s message. Many asked that these truths be recorded and kept for future reference.

Finally, we all agreed to continue exploring this key of Faith next week, looking at more scripture verses to help us grow even stronger in it.

<strong>Memory verse for the week:</strong>
"So then faith comes by hearing, and hearing by the word of God." (Romans 10:17)

Thank you for your open hearts and honest sharing. Let’s keep walking in great faith this week and watch God move!
See you next Saturday as we go deeper into The Key of Faith.

Love and grace,
$EN$,

  -- Amharic summary
  $AM$
<h3>የመንግሥቱ ቤተሰብ – የዛሬው ስብሰባ ማጠቃለያ</h3>

<strong>ጭብጥ፦ ሦስተኛው የመንግሥተ ሰማይ ቁልፍ – እምነት</strong>

በእግዚአብሔር ፊት ላሳለፍነው ሌላ ጠንካራ እና ፍሬያማ ጊዜ እግዚአብሔር ይመስገን! 🙌

እንደተለመደው፣ "የመንግሥተ ሰማይ ቁልፎች – በዚህች አሁን በሆነችው መንግሥት ውስጥ እንዴት መኖር እንችላለን" በሚለው ተከታታይ ትምህርታችን ላይ ቀጥለናል።

በመጀመሪያ፣ ባለፈው ሳምንት ስለ "ይቅርታ" እና "ስለ አለመጨነቅ" ቁልፎች የነበረንን ትምህርት አጠቃለናል። ዛሬ ደግሞ ወደ ሦስተኛው ቁልፍ ተሻገርን፦ እምነት።

በትምህርታችን መጀመሪያ ላይ በዕብራውያን 11:1 ላይ ያለውን ግልጽ ትርጓሜ ተመለከትን፦
"እምነትም ተስፋ ስለምናደርገው ነገር የሚያስረግጥ፥ የማናየውንም ነገር የሚያስረዳ ነው።"

በመቀጠልም እምነት እንዴት እንደሚመጣ በሮሜ 10:17 መሠረት አየን፦
"እንግዲያስ እምነት ከመስማት ነው መስማትም በእግዚአብሔር ቃል ነው።"

በወንጌላት ውስጥ ስለ "ትንሽ እምነት" እና "ታላቅ እምነት" የሚናገሩ ምሳሌዎችን ተመልክተናል፦
• በማቴዎስ 8:5-13 ላይ ያለው የመቶ አለቃው፤ በታላቅ እምነቱ ኢየሱስን ያስደነቀ።
• በማቴዎስ 9:20-22 ላይ የምትገኘው የደም መፍሰስ በሽታ የነበረባት ሴት፤ በግል እምነቷ ፈውስን ያገኘች።

በጣም የበለጸገ ውይይት እና ኃይለኛ ምስክርነቶች ነበሩን። በሁሉም ሰው ልብ ውስጥ የቀረ አንድ ትልቅ እውነት ይህንን አስደናቂ ምስል ያሳያል፦

ምድራዊ መንግሥታት በግዛታቸው ውስጥ ለሚደረጉ ግብይቶች የራሳቸው የሆነ መገበያያ ገንዘብ እንዳላቸው ሁሉ፣ የእግዚአብሔርም መንግሥት የራሷ የሆነ መንፈሳዊ መገበያያ ገንዘብ አላት — ይህ መገበያያ ገንዘብ ደግሞ <strong>እምነት</strong> ይባላል።

በዚህ ዓለም ላይ ጥቂት ገንዘብ ያላቸው ሰዎች እንደ ድሃ የሚቆጠሩና ሕይወት የሚከብዳቸው ሲሆን፣ ብዙ ያላቸው ደግሞ ባለጸጎች ናቸው። በእግዚአብሔርም መንግሥት ውስጥ ሁኔታው እንዲሁ ነው፦
• ትንሽ እምነት ያላቸው ሰዎች በሕይወታቸው ውስጥ ብዙ ጊዜ ይታገላሉ (ይቸገራሉ)።
• ታላቅ እምነት ያላቸው ግን ተአምራትን እንኳ ማየትና መለማመድ ይችላሉ።

እምነት በዚህ ዓለም ላይ እጅግ ጠንካራ እና ውድ የሆነ መገበያያ ገንዘብ ነው — በመንግሥቱ ውስጥ ማንኛውንም ነገር "መግዛት" ይችላል! ለዚህም ነው ኢየሱስ፦ "ለሚያምን ሁሉ ይቻላል" በማለት ያወጀው (ማርቆስ 9:23፤ ማቴዎስ 17:20ን በተጨማሪ ይመልከቱ)።

ሁሉም ሰው በዛሬው መልእክት ታላቅ ደስታና መነቃቃት እንደተሰማው ገልጿል። ብዙዎች እነዚህ እውነቶች ተመዝግበው ለወደፊት ማጣቀሻ እንዲቀመጡ ጠይቀዋል።

በመጨረሻም፣ በሚቀጥለው ሳምንት በዚህ የእምነት ቁልፍ ላይ በጥልቀት ለመቀጠል እና በእምነት ይበልጥ እንድናድግ የሚያግዙንን ተጨማሪ የመጽሐፍ ቅዱስ ጥቅሶችን ለመመልከት ሁላችንም ተስማምተናል።

<strong>የሳምንቱ የማስታወሻ ጥቅስ፦</strong>
"እንግዲያስ እምነት ከመስማት ነው መስማትም በእግዚአብሔር ቃል ነው።" (ሮሜ 10:17)

ለተከፈቱ ልቦቻችሁ እና ቅን ለነበረው የሃሳብ አካፋፋይ መንፈስ ከልብ አመሰግናለሁ። በዚህ ሳምንት በታላቅ እምነት መመላለሳችንን እንቀጥል፣ እግዚአብሔርም ሲሠራ እንመልከት!
ወደ እምነት ቁልፍ ይበልጥ በጥልቀት ለመግባት በሚቀጥለው ቅዳሜ እንገናኝ።

በፍቅር እና በጸጋ፣
$AM$,

  -- scripture_references (JSONB)
  '[{"book": "Hebrews", "chapter": 11, "verses": "1"},
    {"book": "Romans", "chapter": 10, "verses": "17"},
    {"book": "Matthew", "chapter": 8, "verses": "5-13"},
    {"book": "Matthew", "chapter": 9, "verses": "20-22"},
    {"book": "Mark", "chapter": 9, "verses": "23"},
    {"book": "Matthew", "chapter": 17, "verses": "20"}]'::jsonb,

  null,   -- speaker_id
  null,   -- series_id
  null,   -- video_url

  -- placeholder thumbnail URL
  'https://res.cloudinary.com/demo/image/upload/v1652345762/sermons/placeholder.jpg',

  null,   -- audio_url
  null,   -- pdf_url

  -- memory_verse_en
  $MVEN$
"So then faith comes by hearing, and hearing by the word of God."
— Romans 10:17
$MVEN$,

  -- memory_verse_am
  $MVAM$
"እንግዲያስ እምነት ከመስማት ነው መስማትም በእግዚአብሔር ቃል ነው።"
— ሮሜ 10:17
$MVAM$,

  '[]'::jsonb,  -- prayer_points
  '[]'::jsonb,  -- discussion_questions

  true,                            -- is_published
  '2026-04-19 09:00:00+00'::timestamptz,  -- published_at
  0,                               -- view_count
  null,                            -- created_by (replace with your UUID if desired)
  '2026-04-19 09:00:00+00'::timestamptz,  -- created_at
  '2026-04-19 09:00:00+00'::timestamptz   -- updated_at
)
returning id, title_en, title_am, published_at;
