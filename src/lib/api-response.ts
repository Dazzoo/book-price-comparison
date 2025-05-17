// lib/api-response.ts
export class ApiResponse<T> {
    constructor(
      public data: T | null,
      public message?: string,
      public status: 'success' | 'error' = 'success'
    ) {}
  
    static success<T>(data: T, message?: string) {
      return new ApiResponse(data, message, 'success')
    }
  
    static error(message: string, code?: string) {
      return new ApiResponse(null, message, 'error')
    }
  }