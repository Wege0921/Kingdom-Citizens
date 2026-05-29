import { PrismaClient } from '@prisma/client'
import { UserRole, Language, DifficultyLevel } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default admin user (will be linked to Supabase auth)
  const adminId = '00000000-0000-0000-0000-000000000001'
  const adminProfile = await prisma.profile.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      languagePreference: Language.en,
    },
  })
  console.log('✅ Created admin profile')

  // Create sample speakers
  const speaker1 = await prisma.speaker.upsert({
    where: { id: 'speaker-1' },
    update: {},
    create: {
      id: 'speaker-1',
      name: 'Pastor John Doe',
      bioEn: 'Senior pastor with 20 years of experience in ministry.',
      bioAm: 'የ20 ዓመታት ልዩና ባለሙያ ቀዳማዊ አስተማማኝ',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=John',
      isActive: true,
    },
  })

  const speaker2 = await prisma.speaker.upsert({
    where: { id: 'speaker-2' },
    update: {},
    create: {
      id: 'speaker-2',
      name: 'Pastor Jane Smith',
      bioEn: 'Associate pastor focused on youth ministry and outreach.',
      bioAm: 'የወጣቶች ሚኒስትሪ እና ውጭ አገልግሎት ላይ የተተኩረ ረዳት አስተማማኝ',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane',
      isActive: true,
    },
  })
  console.log('✅ Created sample speakers')

  // Create sample series
  const series1 = await prisma.series.upsert({
    where: { id: 'series-1' },
    update: {},
    create: {
      id: 'series-1',
      titleEn: 'Foundations of Faith',
      titleAm: 'የእምነት መሰረቶች',
      descriptionEn: 'A comprehensive series on the fundamental teachings of Christianity.',
      descriptionAm: 'ስለ ክርስትናነት መሰረታዊ ትምህርቶች የተሸፈ ሙሉ ተከታታይ',
      coverImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800',
      isActive: true,
    },
  })

  const series2 = await prisma.series.upsert({
    where: { id: 'series-2' },
    update: {},
    create: {
      id: 'series-2',
      titleEn: 'Walking in Wisdom',
      titleAm: 'በጥበብ መሄድ',
      descriptionEn: 'Biblical wisdom for everyday life and decision making.',
      descriptionAm: 'ለየዕለት ተደጋጋሪ ህይወት እና ለውሳኔ መስጫ ብልሃት',
      coverImage: 'https://images.unsplash.com/photo-1507692045161-9d9d4c7d8c1e?w=800',
      isActive: true,
    },
  })
  console.log('✅ Created sample series')

  // Create sample topics
  const topic1 = await prisma.topic.upsert({
    where: { id: 'topic-1' },
    update: {},
    create: {
      id: 'topic-1',
      nameEn: 'Prayer',
      nameAm: 'ጸሎት',
    },
  })

  const topic2 = await prisma.topic.upsert({
    where: { id: 'topic-2' },
    update: {},
    create: {
      id: 'topic-2',
      nameEn: 'Faith',
      nameAm: 'እምነት',
    },
  })

  const topic3 = await prisma.topic.upsert({
    where: { id: 'topic-3' },
    update: {},
    create: {
      id: 'topic-3',
      nameEn: 'Love',
      nameAm: 'ፍቅር',
    },
  })
  console.log('✅ Created sample topics')

  // Create sample learning path
  const learningPath = await prisma.learningPath.upsert({
    where: { id: 'path-1' },
    update: {},
    create: {
      id: 'path-1',
      titleEn: 'New Believers Course',
      titleAm: 'ለአዳዲስ እምነተኞች ኮርስ',
      descriptionEn: 'A foundational course for new Christians to grow in their faith.',
      descriptionAm: 'ለአዳዲስ ክርስትያኖች እምነታቸውን ለማዳበር መሰረታዊ ኮርስ',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      difficultyLevel: DifficultyLevel.beginner,
      estimatedDurationMinutes: 180,
      isPublished: true,
      sortOrder: 1,
      createdById: adminId,
    },
  })
  console.log('✅ Created sample learning path')

  // Create sample learning module
  const module1 = await prisma.learningModule.upsert({
    where: { id: 'module-1' },
    update: {},
    create: {
      id: 'module-1',
      learningPathId: learningPath.id,
      titleEn: 'Understanding Salvation',
      titleAm: 'መዳንን መረዳት',
      contentEn: '<p>Salvation is the foundational truth of Christianity. In this module, we explore what it means to be saved and how to receive God\'s gift of salvation.</p>',
      contentAm: '<p>መዳን የክርስትናነት መሰረታዊ እውነት ነው። በዚህ ሞጁል መዳን ምን ማለት እንደሆነ እና የአምላክን የመዳን ስጦታ እንዴት እንደሚቀበል እንመረዳለን።</p>',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sortOrder: 1,
      estimatedDurationMinutes: 30,
    },
  })
  console.log('✅ Created sample learning module')

  // Create sample quiz
  const quiz1 = await prisma.quiz.upsert({
    where: { id: 'quiz-1' },
    update: {},
    create: {
      id: 'quiz-1',
      moduleId: module1.id,
      questionEn: 'What is the primary way to receive salvation according to Christianity?',
      questionAm: 'ክርስትናነት መሰረት መዳን ዋና መንገድ ምንድን ነው?',
      optionsEn: ['Good works', 'Faith in Jesus Christ', 'Church attendance', 'Following rules'],
      optionsAm: ['መልካም ስራዎች', 'በኢየሱስ ክርስቶስ እምነት', 'ቤተ ክርስቲያን መገኘት', 'ህጎችን መከተል'],
      correctIndex: 1,
      explanationEn: 'Salvation comes through faith in Jesus Christ, not by our own works (Ephesians 2:8-9).',
      explanationAm: 'መዳን በኢየሱስ ክርስቶስ እምነት ይመጣል፣ በራሳችን ስራ አይደለም (ኤፌሶን 2:8-9)።',
      sortOrder: 1,
    },
  })
  console.log('✅ Created sample quiz')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
