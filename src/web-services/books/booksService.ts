import { GoogleBook } from '@/types'
import { CategoryId } from '@/config/categories'

const BASE_URL = '/api/books'

export class BooksService {
  /**
   * Search for books using the Google Books API
   * @param query Search query
   * @param language Language code
   * @param category Optional category to filter by
   * @returns Promise with array of books
   */
  static async search(query: string, language: string, category?: CategoryId): Promise<GoogleBook[]> {
    // If no query or category, fetch popular books
    const searchQuery = query.trim() || category
      ? `${category ? category + ' ' : ''}${query}`
      : 'popular books'

    const response = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&lang=${language}`
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to search books')
    }

    return data.books
  }

  /**
   * Get books by category
   * @param language Language code
   * @param category Category name
   * @returns Promise with array of books
   */
  static async getByCategory(language: string, category?: CategoryId): Promise<GoogleBook[]> {
    // Use the category name directly in the query
    const query = category || ''
    return this.search(query, language)
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