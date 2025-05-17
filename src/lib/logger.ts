// lib/logger.ts
import { pino } from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
  },
})

// Logging middleware
export const logMiddleware = async (req: Request, next: () => Promise<Response>) => {
  const start = Date.now()
  try {
    const response = await next()
    const duration = Date.now() - start
    
    logger.info({
      method: req.method,
      url: req.url,
      status: response.status,
      duration,
    }, 'Request completed')
    
    return response
  } catch (error) {
    const duration = Date.now() - start
    
    logger.error({
      method: req.method,
      url: req.url,
      error,
      duration,
    }, 'Request failed')
    
    throw error
  }
}