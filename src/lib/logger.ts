// lib/logger.ts
import { pino } from 'pino'

// Create a browser-safe logger
const createLogger = () => {
  if (typeof window === 'undefined') {
    // Server-side logger
    return pino({
  level: process.env.LOG_LEVEL || 'info',
      browser: {
        write: {
          info: (...args) => console.log(...args),
          error: (...args) => console.error(...args),
          warn: (...args) => console.warn(...args),
          debug: (...args) => console.debug(...args),
        },
      },
    })
  }
  
  // Client-side logger
  return pino({
    level: process.env.LOG_LEVEL || 'info',
    browser: {
      write: {
        info: (...args) => console.log(...args),
        error: (...args) => console.error(...args),
        warn: (...args) => console.warn(...args),
        debug: (...args) => console.debug(...args),
      },
  },
})
}

export const logger = createLogger()

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
      error: error instanceof Error ? error.message : String(error),
      duration,
    }, 'Request failed')
    
    throw error
  }
}