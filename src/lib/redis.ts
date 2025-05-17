// lib/redis.ts
import { Redis } from '@upstash/redis'
import { env } from './env'

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

// Cache keys
export const CACHE_KEYS = {
  book: (id: string) => `book:${id}`,
  bookPrices: (id: string) => `book:prices:${id}`,
  searchResults: (query: string) => `search:${query}`,
} as const

// Cache TTLs
export const CACHE_TTL = {
  book: 60 * 60, // 1 hour
  prices: 60 * 15, // 15 minutes
  search: 60 * 30, // 30 minutes
} as const