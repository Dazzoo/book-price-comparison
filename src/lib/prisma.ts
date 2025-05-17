// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Logging middleware
prisma.$on('query', (e: { query: string; params: unknown; duration: number }) => {
  logger.debug({ query: e.query, params: e.params, duration: e.duration }, 'Prisma Query')
})

prisma.$on('error', (e: { message: string }) => {
  logger.error({ error: e.message }, 'Prisma Error')
})