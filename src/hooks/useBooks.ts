import { useQuery } from '@tanstack/react-query'
import { BooksService } from '@/web-services/books/booksService'

export function useBooks() {
  /**
   * Hook for searching books
   */
  const useSearchBooks = (query: string, language: string) => {
    return useQuery({
      queryKey: ['books', 'search', query, language],
      queryFn: () => BooksService.search(query, language),
      enabled: !!query.trim(),
    })
  }

  /**
   * Hook for getting bestsellers
   */
  const useBestsellers = (language: string) => {
    return useQuery({
      queryKey: ['books', 'bestsellers', language],
      queryFn: () => BooksService.getBestsellers(language),
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
    useBestsellers,
    useBook,
  }
} 