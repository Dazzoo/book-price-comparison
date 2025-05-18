// lib/env.ts
import { z } from 'zod'

// Define the schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url({
    message: "DATABASE_URL is required and must be a valid URL",
  }),
  
  // Redis
  UPSTASH_REDIS_REST_URL: z.string().url({
    message: "UPSTASH_REDIS_REST_URL is required and must be a valid URL",
  }),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, {
    message: "UPSTASH_REDIS_REST_TOKEN is required",
  }),
  
  // API Keys
  GOOGLE_BOOKS_API_KEY: z.string().min(1, {
    message: "GOOGLE_BOOKS_API_KEY is required",
  }),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({ message: "NODE_ENV must be development, production, or test" }),
  }),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),
})

// Create a function to validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      console.error('❌ Invalid environment variables:', {
        missing: missingVars,
        errors: error.errors,
      })
      console.error('\n💡 Tip: Check if you have copied .env.example to .env and filled in all required values')
      process.exit(1)
    }
    throw error
  }
}

// Export validated env
export const env = validateEnv()

// Type for the environment variables
export type Env = z.infer<typeof envSchema>