import { BookSearch } from "@/components/BookSearch";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Price Comparison
          </h1>
          <p className="text-xl text-gray-600">
            Search for books and compare prices across different stores
          </p>
        </div>
        <BookSearch />
      </div>
    </main>
  )
}
