-- Publish the "The Power of the Tongue" bilingual sermon
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
  'The Power of the Tongue',
  'የአንደበት ኃይል',

  -- English summary
  $EN$
<h3>Kingdom Family,</h3>

Grace and peace to you all!

We had a wonderful, powerful, and very fruitful teaching session last Saturday on <strong>“The Power of the Tongue”</strong> as one of the important Keys of the Kingdom. Even though the session took longer than usual, the discussion was rich, deep, and anointed. Everyone participated actively, sharing powerful personal experiences and testimonies about how the words we speak have affected their daily lives.

<strong>Main Teaching Summary</strong>

We learned that the tongue is a small part of the body, yet it carries great power. The Bible clearly shows that our words can produce life or death, blessing or cursing — not only in our own lives but also in the lives of others.

<strong>Key Scriptures we studied:</strong>

<strong>Proverbs 18:21</strong>
“Death and life are in the power of the tongue, and those who love it will eat its fruit.”

<strong>James 3:5-6, 9-10</strong>
The tongue is like a small fire that can set a great forest ablaze. From the same mouth can come both blessing and cursing — and this should not be so.

<strong>Matthew 12:34</strong>
“For the mouth speaks what the heart is full of.”

<strong>Romans 10:9-10</strong>
“If you declare with your mouth, ‘Jesus is Lord,’ and believe in your heart that God raised him from the dead, you will be saved.”
→ Our words have the power to bring salvation.

<strong>Psalms 34:12-13</strong>
“Whoever of you loves life and desires to see many good days, keep your tongue from evil and your lips from telling lies.”

We also saw how negative words can block our destiny and hinder God’s blessings, while faith-filled words release God’s power and open doors.

<strong>Powerful Takeaways</strong>

• The tongue, mouth, and lips work together to create words that carry spiritual power — they can bring life or death to ourselves and to others.
• Our spoken words play a direct role in receiving salvation (Romans 10:9-10).
• Negative words can block or delay God’s purpose in our lives (James 3).
• We are commanded to guard our lips if we want to enjoy good days (Psalm 34:12-13).

The teaching brought great awareness to every member: As citizens of the Kingdom of God, controlling our tongue is one of the practical keys to living a life of peace, joy, and victory.

At the end of the session, we all agreed to a practical challenge for this week: To abstain from negative talk, complaining, and gossip. We committed to train our tongues to speak life, faith, and encouragement only. As Jesus said, “You are the light of the world… You are the salt of the earth” (Matthew 5:13-14). Therefore, we must not speak or confess negative things among ourselves or with others.

The session ended with powerful testimonies and prayer. Everyone left uplifted and determined to use their tongue as a tool for the Kingdom.

<strong>Next Week:</strong>
We will meet again this Saturday to continue with another powerful Key of the Kingdom.

<strong>Memory Verse for This Week:</strong>
“Death and life are in the power of the tongue…” (Proverbs 18:21)

Thank you all for your active participation and honesty. Let us continue practicing what we learned and watch God move in our lives!

Blessings and love,
$EN$,

  -- Amharic summary
  $AM$
<h3>ለኪንግደም ቤተሰቦች (Kingdom Family)፦</h3>

የጌታ ጸጋና ሰላም ለሁላችሁ ይሁን!

ባለፈው ቅዳሜ ስለ <strong>“የአንደበት ኃይል”</strong> እንደ አንዱ ወሳኝ የኪንግደም ቁልፍ (Keys of the Kingdom) ያደረግነው ትምህርት ድንቅ፣ ኃይል ያለውና በጣም ፍሬያማ ነበር። ትምህርቱ ከተለመደው ሰዓት በላይ ቢቆይም፣ ውይይቱ ጥልቅ፣ የበለጸገ እና በቅባት የተሞላ ነበር። ሁሉም አባል በንቃት በመሳተፍ፣ የሚናገሯቸው ቃላት በዕለት ተዕለት ሕይወታቸው ላይ ስላመጡት ተጽዕኖ የራሳቸውን ልምድና ምስክርነት አካፍለዋል።

<strong>የዋናው ትምህርት ማጠቃለያ</strong>

ምላስ ትንሽ የሰውነት ክፍል ብትሆንም ታላቅ ኃይል እንዳላት ተምረናል። መጽሐፍ ቅዱስ በግልጽ እንደሚነግረን፣ ቃላቶቻችን በራሳችንም ሆነ በሌሎች ሕይወት ላይ ሕይወትን ወይም ሞትን፣ በረከትን ወይም እርግማንን የማምጣት አቅም አላቸው።

<strong>ያጠናናቸው ቁልፍ ጥቅሶች፦</strong>

<strong>ምሳሌ 18፥21</strong> — “ሞትና ሕይወት በምላስ እጅ ናቸው፤ የሚወዷትም ፍሬዋን ይበላሉ።”

<strong>ያዕቆብ 3፥5-6፣ 9-10</strong> — ምላስ ታላቅ ጫካን እንደሚያቃጥል ትንሽ እሳት ናት። ከአንድ አፍ በረከትና መርገም ይወጣሉ፤ ወንድሞቼ ሆይ፥ ይህ እንዲህ ሊሆን አይገባም።

<strong>ማቴዎስ 12፥34</strong> — “በልብ ሞልቶ ከተረፈው አፍ ይናገራልና።”

<strong>ሮሜ 10፥9-10</strong> — “ኢየሱስ ጌታ እንደ ሆነ በአፍህ ብትመሰክር... ትድናለህ።” → ቃላቶቻችን መዳናችንን እንኳም የመወሰን ኃይል አላቸው።

<strong>መዝሙር 34፥12-13</strong> — “ሕይወትን የሚፈቅድ ሰው ማን ነው? በጎንም ዘመኖች ለማየት የሚወድድ? ምላስህን ከክፉ ከልክል፥ ከንፈሮችህም ሽንገላን እንዳይናገሩ።”

በተጨማሪም አሉታዊ ቃላት እጣ ፈንታችንን (Destiny) እንዴት እንደሚዘጉና የእግዚአብሔርን በረከት እንደሚያደናቅፉ፤ በተቃራኒው ደግሞ በእምነት የተሞሉ ቃላት የእግዚአብሔርን ኃይል እንደሚለቁና በሮችን እንደሚከፍቱ ተመልክተናል።

<strong>ዋና ዋና ትምህርቶች</strong>

• ምላስ፣ አፍ እና ከንፈር ተቀናጅተው መንፈሳዊ ኃይል ያላቸውን ቃላት ይፈጥራሉ፤ እነዚህም በራሳችንና በሌሎች ላይ <strong>ሕይወትን ወይም ሞትን</strong> ሊያመጡ ይችላሉ።
• የምንናገራቸው ቃላት ድነትን (Salvation) በመቀበል ረገድ ቀጥተኛ ሚና አላቸው (ሮሜ 10:9-10)።
• አሉታዊ ቃላት እግዚአብሔር በሕይወታችን ስላለው ዓላማ እንቅፋት ሊሆኑ ወይም ሊያዘገዩ ይችላሉ (ያዕቆብ 3)።
• ጥሩ ዘመናትን ማየት ከፈለግን ከንፈራችንን እንድንጠብቅ ታዘናል (መዝሙር 34:12-13)።

ትምህርቱ ለእያንዳንዱ አባል ትልቅ ግንዛቤን ሰጥቷል፡- እንደ እግዚአብሔር መንግሥት ዜጎች፣ ምላሳችንን መቆጣጠር በሰላም፣ በደስታ እና በድል ለመኖር አንዱ ተግባራዊ ቁልፍ ነው።

በክፍለ ጊዜው ማብቂያ ላይ፣ ለዚህ ሳምንት የሚሆን <strong>ተግባራዊ ልምምድ</strong> ለማድረግ ሁላችንም ተስማምተናል፦

ከአሉታዊ ንግግር፣ ከማጉረምረም እና ከሀሜት ለመራቅ ወስነናል። አንደበታችንን ሕይወትን፣ እምነትን እና ማበረታቻን ብቻ እንዲናገር ለማሰልጠን ቃል ገብተናል። ኢየሱስ እንደተናገረው፡- “እናንተ የዓለም ብርሃን ናችሁ... እናንተ የምድር ጨው ናችሁ” (ማቴዎስ 5:13-14)። ስለዚህ በመካከላችንም ሆነ ከሌሎች ጋር ስንሆን አሉታዊ ነገሮችን መናገር ወይም መናዘዝ የለብንም።

ትምህርቱ በኃይለኛ ምስክርነቶች እና በጸሎት ተጠናቋል። ሁሉም ሰው ተበረታትቶ እና አንደበቱን ለመንግሥቱ አገልግሎት እንደ መሣሪያ ለመጠቀም ወስኖ ወጥቷል።

<strong>የሚቀጥለው ሳምንት፦</strong>
በሌላ ኃይለኛ የኪንግደም ቁልፍ (Key of the Kingdom) ለመቀጠል በዚህ ቅዳሜ እንደገና እንገናኛለን።

<strong>የዚህ ሳምንት የጥናት ጥቅስ (Memory Verse)፦</strong>
“ሞትና ሕይወት በምላስ እጅ ናቸው...” (ምሳሌ 18፥21)

ስለ ንቁ ተሳትፏችሁ እና ስለ ቅንነታችሁ ሁላችሁንም አመሰግናለሁ። የተማርነውን በተግባር ማዋል እንቀጥል፣ እግዚአብሔርም በሕይወታችን ሲሠራ እንመልከት!

በረከትና ፍቅር ለሁላችሁ ይሁን፣

ደመላሽ (ወንድማችሁና አቅራቢ)
$AM$,

  -- scripture_references (JSONB)
  '[{"book": "Proverbs", "chapter": 18, "verses": "21"},
    {"book": "James", "chapter": 3, "verses": "5-6"},
    {"book": "James", "chapter": 3, "verses": "9-10"},
    {"book": "Matthew", "chapter": 12, "verses": "34"},
    {"book": "Romans", "chapter": 10, "verses": "9-10"},
    {"book": "Psalms", "chapter": 34, "verses": "12-13"},
    {"book": "Matthew", "chapter": 5, "verses": "13-14"}]'::jsonb,

  null,   -- speaker_id
  null,   -- series_id
  null,   -- video_url

  -- placeholder thumbnail URL
  'https://res.cloudinary.com/demo/image/upload/v1652345762/sermons/placeholder.jpg',

  null,   -- audio_url
  null,   -- pdf_url

  -- memory_verse_en
  $MVEN$
“Death and life are in the power of the tongue...”
— Proverbs 18:21
$MVEN$,

  -- memory_verse_am
  $MVAM$
“ሞትና ሕይወት በምላስ እጅ ናቸው...”
— ምሳሌ 18፥21
$MVAM$,

  '[]'::jsonb,  -- prayer_points
  '[]'::jsonb,  -- discussion_questions

  true,                            -- is_published
  '2026-05-10 09:00:00+00'::timestamptz,  -- published_at
  0,                               -- view_count
  null,                            -- created_by (replace with your UUID if desired)
  '2026-05-10 09:00:00+00'::timestamptz,  -- created_at
  '2026-05-10 09:00:00+00'::timestamptz   -- updated_at
)
returning id, title_en, title_am, published_at;
