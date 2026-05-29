-- Publish the "Keys of the Kingdom" bilingual sermon
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
  'Keys of the Kingdom: Forgiveness & Trust',
  'የመንግሥተ ሰማያት መክፈቻዎች፡ ይቅርታ እና እምነት',

  -- English summary
  E'<h3>Keys of the Kingdom</h3>\n\n'
  'Today we continued our study on the Kingdom of God.\n\n'
  'We focused on two practical “keys” that Jesus gives us to live fully under God’s reign. '
  'These keys flow directly from the authority Jesus described in Matthew 16:19 '
  '(the keys of the Kingdom) and connect with the “secret/mystery of the Kingdom” '
  'and the comforting promise to the “little flock” in Luke 12:32.\n\n'
  '<strong>1. The Key of Forgiveness 🔑</strong>\n\n'
  'Forgiveness is the power to “loose” sins on earth so they are loosed in heaven. '
  'We looked at:\n'
  '• Matthew 16:19\n'
  '• Matthew 6:14–15 (forgiving others so the Father forgives us)\n'
  '• Matthew 18:21–35 (the Parable of the Unforgiving Servant)\n\n'
  '<strong>2. The Key of Not Worrying About Tomorrow 🔑</strong>\n\n'
  'This is the daily trust that God will provide when we seek His Kingdom first. We studied:\n'
  '• Matthew 6:25–34 (“Do not worry about tomorrow… seek first the kingdom”)\n'
  '• Luke 12:22–34 (the full passage ending with “Do not be afraid, little flock, '
  '  for your Father has been pleased to give you the kingdom”)\n\n'
  'We saw how these two keys work together: when we forgive, we walk in freedom; '
  'when we refuse to worry, we experience the Kingdom as a present gift rather than a future anxiety. '
  'Both are part of the humble, powerful way God’s Kingdom operates right now.\n\n'
  'We agreed that we shall continue studying other keys of the Kingdom in the coming weeks, '
  'exploring more Scriptures together.\n\n'
  'Thank you for a wonderful time in God’s Word. I look forward to our next meeting.',

  -- Amharic summary
  E'<h3>የመንግሥተ ሰማያት መክፈቻዎች</h3>\n\n'
  'ዛሬ ስለ እግዚአብሔር መንግሥት የጀመርነውን ጥናት ቀጥለናል።\n\n'
  'በእግዚአብሔር መንግሥት ስር ሙሉ በሙሉ ለመኖር ኢየሱስ በሰጠን ሁለት ተግባራዊ “መክፈቻዎች” (ቁልፎች) ላይ ትኩረት አድርገናል። '
  'እነዚህ መክፈቻዎች ኢየሱስ በማቴዎስ 16:19 ላይ ከገለጸው ሥልጣን (የመንግሥተ ሰማያት መክፈቻዎች) የሚመነጩ ሲሆን፥ '
  'በሉቃስ 12:32 ላይ ለ “ታናሽ መንጋ” ከተሰጠው አጽናኝ ተስፋና ከመንግሥቱ ምስጢር ጋር ይገናኛሉ።\n\n'
  '<strong>1. ይቅርታ 🔑</strong>\n\n'
  'ይቅር ባይነት በምድር ላይ ለሕይወታችን አርነትን የሚያጎናፅፈን ከጌታ የተሰጠ ትእዛዝ ሲሆን፥ '
  'ይህም ሕይወታችን በምድርም በሰማይም የተፈታ እንዲሆን ያደርጋል። የተመለከትናቸው ጥቅሶች፦\n'
  '• ማቴዎስ 16:19\n'
  '• ማቴዎስ 6:14–15 (አብ ይቅር እንዲለን እኛ ለሌሎች ይቅርታ ማድረግ እንዳለብን)\n'
  '• ማቴዎስ 18:21–35 (ይቅር ባይ ያልሆነው ባሪያ ምሳሌ)\n\n'
  '<strong>2. ስለ ነገ አለመጨነቅ 🔑</strong>\n\n'
  'ይህም አስቀድመን የእግዚአብሔርን መንግሥት ስንፈልግ እርሱ ደግሞ የሚያስፈልገንን እንደሚሰጠን በማመን '
  'በየቀኑ ምንለማመደው ሕይወት ነው። የተመለከትናቸው ጥቅሶች፦\n'
  '• ማቴዎስ 6:25–34 (“ስለ ነገ አትጨነቁ... አስቀድማችሁ የእግዚአብሔርን መንግሥት ፈልጉ”)\n'
  '• ሉቃስ 12:22–34 (በተለይም “አንተ ታናሽ መንጋ፥ መንግሥቱን ሊሰጣችሁ የአባታችሁ በጎ ፈቃድ ነውና አትፍሩ” የሚለውን ጥቅስ ጨምሮ)\n\n'
  'እነዚህ ሁለት መክፈቻዎች 🔑 እንዴት አብረው እንደሚሠሩ ተመልክተናል፦ '
  'ይቅር ስንል በነፃነት እንመላለሳለን፤ መጨነቅን ስናቆም ደግሞ የእግዚአብሔርን መንግሥት የነገ ተስፋ ሳይሆን የዛሬ ስጦታ አድርገን እንለማመዳለን። '
  'ሁለቱም አሁን ባለበት ሁኔታ የእግዚአብሔር መንግሥት የሚሠራባቸው ትሑት ግን ኃይለኛ መንገዶች ናቸው።\n\n'
  'በሚቀጥሉት ሳምንታት ሌሎች የመንግሥተ ሰማያት መክፈቻዎችን 🔑 ማጥናታችንን ለመቀጠልና '
  'ተጨማሪ ጥቅሶችን አብረን ለመወያየት ተስማምተናል።\n\n'
  'በእግዚአብሔር ቃል ላይ ላሳለፍነው ድንቅ ጊዜ እናመሰግናለን።\n'
  'የጌታ ፀጋ ከሁላችን ጋር ይሁን።',

  -- scripture_references (JSONB)
  '[{"book": "Matthew", "chapter": 16, "verses": "19"},
    {"book": "Luke", "chapter": 12, "verses": "32"},
    {"book": "Matthew", "chapter": 6, "verses": "14-15"},
    {"book": "Matthew", "chapter": 18, "verses": "21-35"},
    {"book": "Matthew", "chapter": 6, "verses": "25-34"},
    {"book": "Luke", "chapter": 12, "verses": "22-34"}]'::jsonb,

  null,   -- speaker_id
  null,   -- series_id
  null,   -- video_url

  -- placeholder thumbnail URL
  'https://res.cloudinary.com/demo/image/upload/v1652345762/sermons/placeholder.jpg',

  null,   -- audio_url
  null,   -- pdf_url

  -- memory_verse_en
  E'"I will give you the keys of the kingdom of heaven; whatever you bind on earth will be bound in heaven, '
  'and whatever you loose on earth will be loosed in heaven."\n— Matthew 16:19',

  -- memory_verse_am
  E'"የመንግሥተ ሰማያትን መክፈቻዎች እሰጥሃለሁ፤ በምድር ምትገዛው ሁሉ በሰማይ እንደተገዛ ይሆናል፣ '
  'በምድርም ምትፈታው ሁሉ በሰማይ እንደተፈታ ይሆናል።"\n— ማቴዎስ 16:19',

  '[]'::jsonb,  -- prayer_points
  '[]'::jsonb,  -- discussion_questions

  true,                            -- is_published
  '2026-04-12 09:00:00+00'::timestamptz,  -- published_at
  0,                               -- view_count
  null,                            -- created_by (replace with your UUID if desired)
  '2026-04-12 09:00:00+00'::timestamptz,  -- created_at
  '2026-04-12 09:00:00+00'::timestamptz   -- updated_at
)
returning id, title_en, title_am, published_at;
