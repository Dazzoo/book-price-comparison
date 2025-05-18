import { BookSearch } from '@/components/BookSearch'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Price Comparison</h1>
          <p className="mt-2 text-gray-600">Search for books and compare prices across different retailers</p>
        </div>
      </header>
      <BookSearch />
    </main>
  )
}
