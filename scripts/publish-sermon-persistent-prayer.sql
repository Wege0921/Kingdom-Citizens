-- Publish the "Persistent Prayer: Three Biblical Cases" bilingual sermon
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
  'Persistent Prayer: Three Biblical Cases',
  'የማይረሳ ጸሎት፡ ሦስት የመጽሐፍ ቅዱስ ታሪኮች',

  -- English summary
  $EN$
<h3>Today’s Teaching Summary</h3>

<p>Grace and peace to you all!</p>

<p>Today we had another powerful and deeply impactful session as we continued our series on <strong>Prayer as one of the Keys of the Kingdom</strong>.</p>

<p>The teaching focused on three important aspects of prayer, and it brought fresh revelation to everyone.</p>

<h4>1. Jesus' Instruction on Persistent Prayer</h4>

<p>We looked at how Jesus taught us to pray and never give up.</p>

<p><strong>Luke 18:1</strong> – “Then Jesus told his disciples a parable to show them that they should always pray and not give up.”</p>

<p><strong>Luke 11:9</strong> – “Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.”</p>

<h4>2. Unanswered Prayers (or Answered Differently)</h4>

<p>We saw that even great men of God sometimes prayed persistently but did not receive what they asked for.</p>

<ul>
<li><strong>Moses (Deuteronomy 3:23-27)</strong> – He pleaded with God to enter the Promised Land, but God said “No.”</li>
<li><strong>David (2 Samuel 12:15-23)</strong> – He fasted and prayed for his sick child for seven days, but the child died.</li>
<li><strong>Apostle Paul (2 Corinthians 12:7-9)</strong> – He prayed three times for God to remove his thorn in the flesh, but God said, “My grace is sufficient for you.”</li>
<li><strong>Jesus (Matthew 26:39)</strong> – In Gethsemane He prayed three times to avoid the cross, yet He submitted to the Father's will.</li>
</ul>

<h4>3. Answered Prayers with Strategy</h4>

<p>We saw how God answered prayers by giving specific instructions to follow.</p>

<ul>
<li><strong>Moses at the Red Sea (Exodus 14:15-16)</strong> – God told him, “Raise your staff and stretch out your hand over the sea.”</li>
<li><strong>Jehoshaphat (2 Chronicles 20:12, 15-17)</strong> – God gave him the strategy: “Stand firm and see the deliverance the Lord will give you.”</li>
<li><strong>Elijah (1 Kings 18:36-39)</strong> – God answered by fire after Elijah prayed.</li>
<li><strong>Nehemiah (Nehemiah 1:4-11)</strong> – God gave him favor with the king after months of prayer.</li>
</ul>

<p>The teaching was explained case by case, with each scripture read clearly so everyone could understand exactly what the Bible says.</p>

<h4>Discussions from the Family</h4>

<p>Everyone was very happy and excited about today's teaching. Many admitted that they knew about prayer before, but they had never understood it at this level. The way the three cases were presented brought new revelation and fresh understanding on how to pray effectively.</p>

<p>Their faith was strengthened, and they left with a clearer picture of how to approach God in prayer particularly with respect, thanks giving and adoration.</p>

<h4>Next Week</h4>

<p>We agreed to meet again next Saturday at the same time to continue with another powerful Key of the Kingdom.</p>

<p><strong>Memory Verse for the Week:</strong></p>
<blockquote>“They should always pray and not give up.” (Luke 18:1)</blockquote>

<p>Thank you all for your hunger and active participation. Let us put into practice everything we have learned about prayer this week.</p>

<p>See you next Saturday!</p>

<p>Blessings and love,<br>Demelash 🙏</p>
$EN$,

  -- Amharic summary
  $AM$
<h3>የዛሬው ትምህርት ሰመሪ</h3>

<p>ጸጋና ሰላም ለሁላችሁ ይሁን!</p>

<p>ዛሬ «ጸሎት የመንግሥቱ መክፈቻዎች አንዱ ነው» በሚለው ተከታታይ ትምህርታችን ላይ በመቀጠል፣ ሌላ እጅግ በጣም ጥሩ ጊዜ ነበረን።</p>

<p>ትምህርቱ ትኩረት ያደረገው በሶስት ዋና ዋና የጸሎት ገጽታዎች ላይ ሲሆን፣ ለሁሉም ሰው መረዳትን የጨመረ ነበር።</p>

<h4>1. ኢየሱስ ስላልተቋረጠ (ስለ መጽናት) ጸሎት የሰጠው ትምረርት</h4>

<p>ኢየሱስ ሁል ጊዜ ልንጸልይና ልንታክት እንደማይገባን እንዴት እንዳስተማረን ተመልክተናል።</p>

<p><strong>ሉቃስ 18፥1</strong> – «ሳይታክቱም ዘወትር ሊጸልዩ እንዲገባቸው የሚገልጽ ምሳሌ ነገራቸው።»</p>

<p><strong>ሉቃስ 11፥9</strong> – «ለምኑ ይሰጣችኋል፤ ፈልጉ ታገኙማላችሁ፤ መዝጊያን አንኳኩ ይከፈትላችኋል።»</p>

<h4>2. መልስ ያላገኙ (ወይም በሌላ መንገድ የተመለሱ) ጸሎቶች</h4>

<p>ታላላቅ የእግዚአብሔር ሰዎች እንኳ ሳይታክቱ ቢጸልዩም የለመኑትን ነገር ያላገኙበት ጊዜ እንዳለ አይተናል።</p>

<ul>
<li><strong>ሙሴ (ዘዳግም 3፥23-27)</strong> – ወደ ተስፋይቱ ምድር ለመግባት እግዚአብሔርን አጥብቆ ለመነው፤ እግዚአብሔር ግን «አይሆንም» አለው።</li>
<li><strong>ዳዊት (2 ሳሙኤል 12፥15-23)</strong> – ስለ ታመመው ልጁ ሰባት ቀን ጾመ፣ ጸለየም፤ ነገር ግን ህጻኑ ሞተ።</li>
<li><strong>ሐዋርያው ጳውሎስ (2 ቆሮንቶስ 12፥7-9)</strong> – በሥጋው ያለውን መዉጊያ እግዚአብሔር እንዲያስወግድለት ሶስት ጊዜ ጸለየ፤ እግዚአብሔር ግን «ጸጋዬ ይበቃሃል» አለው።</li>
<li><strong>ኢየሱስ (ማቴዎስ 26፥39)</strong> – በጌቴሴማኒ ይች ጽዋ ከኔ ትለፋ ብሎ ሶስት ጊዜ ጸለየ፤ ነገር ግን ለአብ ፈቃድ ተገዛ።</li>
</ul>

<h4>3. የተመለሱ ጸሎቶች</h4>

<p>እግዚአብሔር የተወሰኑ መከተል ያለባቸውን መመሪያዎች በመስጠት ለጸሎቶች እንዴት መልስ እንደሰጠ አይተናል።</p>

<ul>
<li><strong>ሙሴ በኤርትራ ባሕር (ዘጸአት 14፥15-16)</strong> – እግዚአብሔር፣ «በትርህን አንሳ፥ እጅህንም በባሕሩ ላይ ዘርጋው» አለው።</li>
<li><strong>ኢዮሣፍጥ (2 ዜና መዋዕል 20፥12፣ 15-17)</strong> – እግዚአብሔር ስትራቴጂውን ሰጠው፦ «ቁሙ፥ እግዚአብሔርም የሚሰጣችሁን ማዳን እዩ።»</li>
<li><strong>ኤልያስ (1 ነገሥት 18፥36-39)</strong> – ኤልያስ ከጸለየ በኋላ እግዚአብሔር በእሳት መለሰ።</li>
<li><strong>ነህምያ (ነህምያ 1፥4-11)</strong> – ከወራት ጸሎት በኋላ እግዚአብሔር በንጉሡ ፊት ሞገስን ሰጠው።</li>
</ul>

<p>ትምህርቱ እያንዳንዱን ታሪክ በተራ በተራ ያብራራ ሲሆን፣ እያንዳንዱ ጥቅስ በግልጽ የተነበበው ሁሉም ሰው መጽሐፍ ቅዱስ በትክክል ምን እንደሚል መረዳት እንዲችል ነው።</p>

<h4>ከቤተሰቡ ጋር የተደረጉ ውይይቶች</h4>

<p>ሁሉም ሰው በዛሬው ትምህርት እጅግ ደስተኛ ነበር። ብዙዎች ቀደም ሲል ስለ ጸሎት ያውቁ እንደነበር፣ ነገር ግን በዚህ ደረጃ ተረድተውት እንደማያውቁ ተናግረዋል። ሶስቱ ታሪኮች የቀረቡበት መንገድ ውጤታማ በሆነ መንገድ እንዴት መጸለይ እንዳለብን አዲስ መገለጥና ጥሩ ግንዛቤን አምጥቷል።</p>

<p>እምነታቸው ጠንክሯል፤ በተለይም በአክብሮት፣ በምስጋና እና በውዳሴ ወደ እግዚአብሔር በጸሎት እንዴት መቅረብ እንዳለባቸው ግልጽ የሆነ መረዳት ይዘው ወጥተዋል።</p>

<h4>የሚቀጥለው ሳምንት</h4>

<p>ሌላ የመንግሥቱን መክፈቻ ቁልፉ ለመማርና ለመወያየት፣ በሚቀጥለው ቅዳሜ በተመሳሳይ ሰዓት እንደገና ለመገናኘት ተስማምተናል።</p>

<p><strong>በዚህ ሳምንት ምናሰላስለዉ ጥቅስ፦</strong></p>
<blockquote>“ደቀ መዛሙርቱ ሳይታክቱ ሁልጊዜ መጸለይ እንደሚገባቸው ለማሳየት ኢየሱስ ይህን ምሳሌ ነገራቸው፤”<br>‭‭ሉቃስ‬ ‭18‬:‭1‬</blockquote>

<p>ስለ መንፈሳዊ ረሃባችሁ እና ስለ ንቁ ተሳትፏችሁ ሁላችሁንም አመሰግናለሁ።</p>

<p>በዚህ ሳምንት ስለ ጸሎት የተማርነውን ሁሉ በተግባር እናውለው።</p>

<p>የሚቀጥለው ቅዳሜ እንገናኝ!</p>

<p>በረከትና ፍቅር ይሁንላችሁ፣<br>ደመላሽ 🙏</p>
$AM$,

  -- scripture_references (JSONB)
  '[{"book": "Luke", "chapter": 18, "verses": "1"},
    {"book": "Luke", "chapter": 11, "verses": "9"},
    {"book": "Deuteronomy", "chapter": 3, "verses": "23-27"},
    {"book": "2 Samuel", "chapter": 12, "verses": "15-23"},
    {"book": "2 Corinthians", "chapter": 12, "verses": "7-9"},
    {"book": "Matthew", "chapter": 26, "verses": "39"},
    {"book": "Exodus", "chapter": 14, "verses": "15-16"},
    {"book": "2 Chronicles", "chapter": 20, "verses": "12, 15-17"},
    {"book": "1 Kings", "chapter": 18, "verses": "36-39"},
    {"book": "Nehemiah", "chapter": 1, "verses": "4-11"}]'::jsonb,

  null,   -- speaker_id
  null,   -- series_id
  null,   -- video_url

  -- worship fallback image
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800',

  null,   -- audio_url
  null,   -- pdf_url

  -- memory_verse_en
  $MVEN$
“They should always pray and not give up.”
— Luke 18:1
$MVEN$,

  -- memory_verse_am
  $MVAM$
«ደቀ መዛሙርቱ ሳይታክቱ ሁልጊዜ መጸለይ እንደሚገባቸው ለማሳየት ኢየሱስ ይህን ምሳሌ ነገራቸው፤»
— ሉቃስ 18:1
$MVAM$,

  '[]'::jsonb,  -- prayer_points
  '[]'::jsonb,  -- discussion_questions

  true,                            -- is_published
  '2026-06-06 09:00:00+00'::timestamptz,  -- published_at (next Saturday)
  0,                               -- view_count
  null,                            -- created_by (replace with your UUID if desired)
  '2026-06-06 09:00:00+00'::timestamptz,  -- created_at
  '2026-06-06 09:00:00+00'::timestamptz   -- updated_at
)
returning id, title_en, title_am, published_at;
