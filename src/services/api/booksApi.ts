import { GoogleBook } from '@/types'

export async function searchBooks(query: string, language: string): Promise<GoogleBook[]> {
  const response = await fetch(
    `/api/books/search?q=${encodeURIComponent(query)}&lang=${language}`
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to search books')
  }

  return data.books
}

export async function getBestsellers(language: string): Promise<GoogleBook[]> {
  const currentYear = new Date().getFullYear()
  return searchBooks(`subject:bestseller ${currentYear}`, language)
} 