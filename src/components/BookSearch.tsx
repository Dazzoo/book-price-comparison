"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookCard } from './BookCard'
import { CATEGORIES, CategoryId } from '@/config/categories'
import { useBooks } from '@/hooks/useBooks'

export function BookSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const { useSearchBooks } = useBooks()

  const updateUrlParams = (updates: { category?: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    if (updates.category !== undefined) {
      if (updates.category) {
        params.set('category', updates.category)
      } else {
        params.delete('category')
      }
    }
    router.push(`?${params.toString()}`)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value
    setCategory(newCategory)
    updateUrlParams({ category: newCategory })
  }

  // Use a single query for both search and category
  const { data: books, isLoading, error } = useSearchBooks(
    query,
    category as CategoryId
  )

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
              value={category}
              onChange={handleCategoryChange}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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
          {books?.length === 0 && !error && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No books found. Try a different search term or category.
            </div>
          )}
        </div>
      )}
    </div>
  )
} 