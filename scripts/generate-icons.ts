/**
 * PWA Icon Generation Script
 * 
 * This script generates all required PWA icon sizes from a source image.
 * 
 * Usage:
 * 1. Place your source icon (minimum 1024x1024) as public/icon-source.png
 * 2. Run: npx tsx scripts/generate-icons.ts
 * 
 * Required icon sizes for PWA:
 * - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512 (Android)
 * - 152x152, 167x167, 180x180, 192x192 (iOS)
 * - 48x48, 96x96, 192x192, 512x512 (Favicon)
 * - maskable icons: 192x192, 512x512
 */

import sharp from 'sharp'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const ICON_SIZES = [
  72, 96, 128, 144, 152, 167, 180, 192, 384, 512
]

const SOURCE_PATH = join(process.cwd(), 'public', 'icon-source.png')
const OUTPUT_DIR = join(process.cwd(), 'public', 'icons')

async function generateIcons() {
  if (!existsSync(SOURCE_PATH)) {
    console.error('❌ Source icon not found at public/icon-source.png')
    console.log('Please place a minimum 1024x1024 PNG image at public/icon-source.png')
    process.exit(1)
  }

  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true })

  console.log('🎨 Generating PWA icons...')

  for (const size of ICON_SIZES) {
    const outputPath = join(OUTPUT_DIR, `icon-${size}x${size}.png`)
    
    await sharp(SOURCE_PATH)
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
      })
      .png({ quality: 90 })
      .toFile(outputPath)
    
    console.log(`✅ Generated ${size}x${size}`)
  }

  // Generate favicon.ico (contains multiple sizes)
  const faviconPath = join(process.cwd(), 'public', 'favicon.ico')
  await sharp(SOURCE_PATH)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(join(process.cwd(), 'public', 'favicon-32x32.png'))
  
  await sharp(SOURCE_PATH)
    .resize(16, 16, { fit: 'cover' })
    .png()
    .toFile(join(process.cwd(), 'public', 'favicon-16x16.png'))

  // Generate apple-touch-icon
  await sharp(SOURCE_PATH)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(join(process.cwd(), 'public', 'apple-touch-icon.png'))

  console.log('✅ Generated favicon sizes')
  console.log('✅ Generated apple-touch-icon.png')
  console.log('🎉 All icons generated successfully!')
}

generateIcons().catch((error) => {
  console.error('❌ Error generating icons:', error)
  process.exit(1)
})
