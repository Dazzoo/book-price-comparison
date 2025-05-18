import { NextRequest, NextResponse } from 'next/server'
import { GoogleBooksService } from '@/services/google-books/googleBooksService'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const maxResults = searchParams.get('maxResults')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const service = new GoogleBooksService()
    const books = await service.searchBooks(
      query,
      maxResults ? parseInt(maxResults, 10) : undefined
    )

    return NextResponse.json({ books })
  } catch (error) {
    logger.error({ error }, 'Failed to search books')
    return NextResponse.json(
      { error: 'Failed to search books' },
      { status: 500 }
    )
  }
} 