// services/google-books/googleBooksService.ts
import { env } from '@/lib/env/env'
import { logger } from '@/lib/logger'
import { AppError } from '@/lib/error'
import { GoogleBook, googleBookSchema } from '@/types'

export class GoogleBooksService {
  private readonly baseUrl = 'https://www.googleapis.com/books/v1'
  private readonly apiKey: string

  constructor() {
    const apiKey = env.GOOGLE_BOOKS_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_BOOKS_API_KEY environment variable is not set')
    }
    this.apiKey = apiKey
  }

  private formatQuery(query: string): string {
    // Remove special characters and extra spaces
    return query.trim().replace(/[^\w\s]/g, '')
  }

  async searchBooks(query: string, maxResults: number = 40): Promise<GoogleBook[]> {
    try {
      const formattedQuery = this.formatQuery(query)
      const url = new URL(`${this.baseUrl}/volumes`)
      url.searchParams.append('q', formattedQuery)
      url.searchParams.append('maxResults', maxResults.toString())
      url.searchParams.append('key', this.apiKey)

      logger.debug({ url: url.toString() }, 'Making Google Books API request')

      const response = await fetch(url.toString())

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = `Google Books API error: ${response.status} ${response.statusText}`
        logger.error({ 
          status: response.status, 
          statusText: response.statusText,
          errorData,
          query: formattedQuery
        }, errorMessage)
        
        if (response.status === 400) {
          throw new AppError('Invalid search query or API key', 400, 'INVALID_REQUEST')
        }
        if (response.status === 403) {
          throw new AppError('Invalid or expired API key', 403, 'INVALID_API_KEY')
        }
        throw new AppError(errorMessage, response.status, 'GOOGLE_BOOKS_API_ERROR')
      }

      const data = await response.json()
      
      if (!data.items) {
        logger.info({ query: formattedQuery }, 'No books found')
        return []
      }

      return data.items.map((item: any) => googleBookSchema.parse(item))
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      logger.error({ errorMessage, query }, 'Failed to search books')
      throw new AppError(
        'Failed to fetch books from Google Books API',
        500,
        'GOOGLE_BOOKS_API_ERROR'
      )
    }
  }

  async getBookById(id: string): Promise<GoogleBook> {
    try {
      const url = new URL(`${this.baseUrl}/volumes/${id}`)
      url.searchParams.append('key', this.apiKey)

      logger.debug({ url: url.toString() }, 'Making Google Books API request')

      const response = await fetch(url.toString())

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = `Google Books API error: ${response.status} ${response.statusText}`
        logger.error({ 
          status: response.status, 
          statusText: response.statusText,
          errorData,
          bookId: id
        }, errorMessage)
        
        if (response.status === 400) {
          throw new AppError('Invalid book ID', 400, 'INVALID_BOOK_ID')
        }
        if (response.status === 403) {
          throw new AppError('Invalid or expired API key', 403, 'INVALID_API_KEY')
        }
        throw new AppError(errorMessage, response.status, 'GOOGLE_BOOKS_API_ERROR')
      }

      const data = await response.json()
      return googleBookSchema.parse(data)
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      logger.error({ errorMessage, bookId: id }, 'Failed to get book')
      throw new AppError(
        'Failed to fetch book from Google Books API',
        500,
        'GOOGLE_BOOKS_API_ERROR'
      )
    }
  }
}