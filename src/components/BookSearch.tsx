"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookCard } from './BookCard'
import { LANGUAGES, getBrowserLanguage } from '@/config/languages'
import { useBooks } from '@/hooks/useBooks'

export function BookSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState(searchParams.get('lang') || 'en')
  const { useSearchBooks, useBestsellers } = useBooks()

  // Set initial language based on browser settings if no language in URL
  useEffect(() => {
    if (!searchParams.get('lang')) {
      const browserLang = getBrowserLanguage()
      setLanguage(browserLang)
      updateLanguageInUrl(browserLang)
    }
  }, [])

  const updateLanguageInUrl = (newLang: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', newLang)
    router.push(`?${params.toString()}`)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    setLanguage(newLang)
    updateLanguageInUrl(newLang)
  }

  // Query for bestsellers
  const bestsellersQuery = useBestsellers(language)

  // Query for search results
  const searchQuery = useSearchBooks(query, language)

  // Use the appropriate query based on whether there's a search query
  const { data: books, isLoading, error } = query.trim() ? searchQuery : bestsellersQuery

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 whitespace-nowrap"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books?.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
          {books?.length === 0 && !error && query && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No books found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  )
} 