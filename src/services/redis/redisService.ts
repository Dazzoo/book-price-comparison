import redis from '@/lib/redis'
import { logger } from '@/lib/logger'

export class RedisService {
  private readonly defaultTTL = 60 * 60 * 24 // 24 hours in seconds

  /**
   * Get a value from cache
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      if (!value) return null
      return JSON.parse(value) as T
    } catch (error) {
      logger.error({ error, key }, 'Failed to get value from cache')
      return null
    }
  }

  /**
   * Set a value in cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds (optional)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value)
      await redis.set(key, serializedValue, { EX: ttl || this.defaultTTL })
      logger.debug({ key }, 'Value cached successfully')
    } catch (error) {
      logger.error({ error, key }, 'Failed to set value in cache')
    }
  }

  /**
   * Delete a value from cache
   * @param key Cache key
   */
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
      logger.debug({ key }, 'Value deleted from cache')
    } catch (error) {
      logger.error({ error, key }, 'Failed to delete value from cache')
    }
  }

  /**
   * Generate a cache key for book search
   * @param query Search query
   * @param language Language code
   * @returns Cache key
   */
  generateSearchKey(query: string, language: string): string {
    return `books:search:${query}:${language}`
  }

  /**
   * Generate a cache key for book details
   * @param bookId Book ID
   * @returns Cache key
   */
  generateBookKey(bookId: string): string {
    return `books:book:${bookId}`
  }
}

// Export a singleton instance
export const redisService = new RedisService() 