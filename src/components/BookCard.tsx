import Image from 'next/image'
import { GoogleBook } from '@/types'

interface BookCardProps {
  book: GoogleBook
}

export function BookCard({ book }: BookCardProps) {
  const thumbnail = book.volumeInfo.imageLinks?.thumbnail
  const title = book.volumeInfo.title
  const authors = book.volumeInfo.authors?.join(', ') || 'Unknown Author'
  const description = book.volumeInfo.description || 'No description available'
  const publishedDate = book.volumeInfo.publishedDate || 'Unknown date'

  console.log('thumbnail', thumbnail)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="mt-2 text-sm">No cover available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{authors}</p>
        <p className="text-xs text-gray-500 mt-1">Published: {publishedDate}</p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{description}</p>
        <div className="mt-4 flex justify-between items-center">
          <a
            href={book.volumeInfo.infoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </a>
          <button
            onClick={() => {/* TODO: Add to comparison list */}}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  )
} 