export interface ScriptureReference {
  book: string
  chapter: number
  verseStart: number
  verseEnd: number | null
  textEn?: string
  textAm?: string
}

const BOOK_PATTERNS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah',
  'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
  'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
]

const BOOK_ALIASES: Record<string, string> = {
  'Gen': 'Genesis',
  'Ex': 'Exodus',
  'Lev': 'Leviticus',
  'Num': 'Numbers',
  'Deut': 'Deuteronomy',
  'Josh': 'Joshua',
  'Judg': 'Judges',
  'Ruth': 'Ruth',
  '1 Sam': '1 Samuel',
  '2 Sam': '2 Samuel',
  '1 Ki': '1 Kings',
  '2 Ki': '2 Kings',
  '1 Chron': '1 Chronicles',
  '2 Chron': '2 Chronicles',
  'Ezra': 'Ezra',
  'Neh': 'Nehemiah',
  'Est': 'Esther',
  'Job': 'Job',
  'Ps': 'Psalm',
  'Prov': 'Proverbs',
  'Eccl': 'Ecclesiastes',
  'Song': 'Song of Solomon',
  'Isa': 'Isaiah',
  'Jer': 'Jeremiah',
  'Lam': 'Lamentations',
  'Ezek': 'Ezekiel',
  'Dan': 'Daniel',
  'Hos': 'Hosea',
  'Joel': 'Joel',
  'Amos': 'Amos',
  'Obad': 'Obadiah',
  'Jonah': 'Jonah',
  'Mic': 'Micah',
  'Nah': 'Nahum',
  'Hab': 'Habakkuk',
  'Zeph': 'Zephaniah',
  'Hag': 'Haggai',
  'Zech': 'Zechariah',
  'Mal': 'Malachi',
  'Matt': 'Matthew',
  'Mk': 'Mark',
  'Lk': 'Luke',
  'Jn': 'John',
  'Acts': 'Acts',
  'Rom': 'Romans',
  '1 Cor': '1 Corinthians',
  '2 Cor': '2 Corinthians',
  'Gal': 'Galatians',
  'Eph': 'Ephesians',
  'Phil': 'Philippians',
  'Col': 'Colossians',
  '1 Thess': '1 Thessalonians',
  '2 Thess': '2 Thessalonians',
  '1 Tim': '1 Timothy',
  '2 Tim': '2 Timothy',
  'Titus': 'Titus',
  'Phlm': 'Philemon',
  'Heb': 'Hebrews',
  'Jas': 'James',
  '1 Pet': '1 Peter',
  '2 Pet': '2 Peter',
  '1 Jn': '1 John',
  '2 Jn': '2 John',
  '3 Jn': '3 John',
  'Jude': 'Jude',
  'Rev': 'Revelation'
}

function normalizeBookName(bookName: string): string {
  const trimmed = bookName.trim()
  // Check if it's already a full book name
  if (BOOK_PATTERNS.includes(trimmed)) {
    return trimmed
  }
  // Check aliases
  return BOOK_ALIASES[trimmed] || trimmed
}

export function detectScriptureReferences(text: string): ScriptureReference[] {
  const references: ScriptureReference[] = []
  
  // Pattern: Book Chapter:Verse or Book Chapter:Verse-Verse
  // Examples: "John 3:16", "Genesis 1:1-3", "1 Corinthians 13:4-7"
  const pattern = /(\d?\s*\w+)\s+(\d+):(\d+)(?:-(\d+))?/gi
  
  let match
  while ((match = pattern.exec(text)) !== null) {
    const bookName = normalizeBookName(match[1])
    const chapter = parseInt(match[2], 10)
    const verseStart = parseInt(match[3], 10)
    const verseEnd = match[4] ? parseInt(match[4], 10) : null
    
    references.push({
      book: bookName,
      chapter,
      verseStart,
      verseEnd,
    })
  }
  
  return references
}

export function formatScriptureReference(ref: ScriptureReference, language: 'en' | 'am' = 'en'): string {
  if (language === 'am') {
    // Amharic format would need translation
    return `${ref.book} ${ref.chapter}:${ref.verseStart}${ref.verseEnd ? `-${ref.verseEnd}` : ''}`
  }
  return `${ref.book} ${ref.chapter}:${ref.verseStart}${ref.verseEnd ? `-${ref.verseEnd}` : ''}`
}

export function parseScriptureInput(input: string): ScriptureReference | null {
  const pattern = /^(\d?\s*\w+)\s+(\d+):(\d+)(?:-(\d+))?$/i
  const match = input.match(pattern)
  
  if (!match) return null
  
  const bookName = normalizeBookName(match[1])
  const chapter = parseInt(match[2], 10)
  const verseStart = parseInt(match[3], 10)
  const verseEnd = match[4] ? parseInt(match[4], 10) : null
  
  return {
    book: bookName,
    chapter,
    verseStart,
    verseEnd,
  }
}
