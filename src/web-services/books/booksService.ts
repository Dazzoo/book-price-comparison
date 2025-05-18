import { GoogleBook } from '@/types'

const BASE_URL = '/api/books'

export class BooksService {
  /**
   * Search for books using the Google Books API
   * @param query Search query
   * @param language Language code
   * @returns Promise with array of books
   */
  static async search(query: string, language: string): Promise<GoogleBook[]> {
    const response = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=${language}`
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to search books')
    }

    return data.books
  }

  /**
   * Get bestseller books for the current year
   * @param language Language code
   * @returns Promise with array of books
   */
  static async getBestsellers(language: string): Promise<GoogleBook[]> {
    const currentYear = new Date().getFullYear()
    return this.search(`subject:bestseller ${currentYear}`, language)
  }

  /**
   * Get a specific book by ID
   * @param id Book ID
   * @returns Promise with book details
   */
  static async getById(id: string): Promise<GoogleBook> {
    const response = await fetch(`${BASE_URL}/${id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get book details')
    }

    return data.book
  }
} 