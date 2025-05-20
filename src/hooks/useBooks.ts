import { useQuery } from '@tanstack/react-query'
import { BooksService } from '@/web-services/books/booksService'
import { CategoryId } from '@/config/categories'

export function useBooks() {
  /**
   * Hook for searching books with optional category filter
   */
  const useSearchBooks = (query: string, category?: CategoryId) => {
    return useQuery({
      queryKey: ['books', 'search', query, category],
      queryFn: () => BooksService.search(query, category || ''),
      // Always enabled to fetch initial books
      enabled: true,
    })
  }

  /**
   * Hook for getting a specific book
   */
  const useBook = (id: string) => {
    return useQuery({
      queryKey: ['books', 'detail', id],
      queryFn: () => BooksService.getById(id),
      enabled: !!id,
    })
  }

  return {
    useSearchBooks,
    useBook,
  }
} 