import { NextRequest, NextResponse } from 'next/server'
import { GoogleBooksService } from '@/services/google-books/googleBooksService'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = new GoogleBooksService()
    const book = await service.getBookById(params.id)

    return NextResponse.json({ book })
  } catch (error) {
    logger.error({ error, bookId: params.id }, 'Failed to get book')
    return NextResponse.json(
      { error: 'Failed to get book' },
      { status: 500 }
    )
  }
} 