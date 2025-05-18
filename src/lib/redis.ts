// lib/redis.ts
import { createClient, RedisClientType } from 'redis'
import { env } from './env/env'
import { logger } from './logger'

const redisClient: RedisClientType = createClient({
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT || '6379')
  }
})

redisClient.on('error', (err: Error) => {
  logger.error({ error: err }, 'Redis Client Error')
})

redisClient.on('connect', () => {
  logger.info('Redis Client Connected')
})

// Connect to Redis
redisClient.connect().catch(console.error)

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

export default redisClient 