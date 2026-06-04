import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { paths } = (await request.json()) as { paths?: string[] }

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: 'Missing paths array' }, { status: 400 })
    }

    const results: { path: string; revalidated: boolean }[] = []

    for (const path of paths) {
      try {
        revalidatePath(path)
        results.push({ path, revalidated: true })
      } catch {
        results.push({ path, revalidated: false })
      }
    }

    return NextResponse.json({ revalidated: true, results })
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
