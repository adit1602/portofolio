import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * On-demand revalidation webhook, called server-to-server by the API
 * right after an admin mutation succeeds, so the landing page updates
 * immediately instead of waiting for the 60s ISR window.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET
  const provided = req.headers.get('authorization')

  if (!expected || provided !== `Bearer ${expected}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/', 'page')

  return NextResponse.json({ revalidated: true })
}
