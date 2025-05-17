// lib/error.ts
export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number,
      public code: string
    ) {
      super(message)
      this.name = 'AppError'
    }
  }
  
  // Common error codes
  export const ErrorCodes = {
    BOOK_NOT_FOUND: 'BOOK_NOT_FOUND',
    INVALID_INPUT: 'INVALID_INPUT',
    DATABASE_ERROR: 'DATABASE_ERROR',
    EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  } as const