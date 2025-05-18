// lib/env.ts
import { z } from 'zod'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Define the schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url({
    message: "DATABASE_URL is required and must be a valid URL",
  }),
  
  // Redis Cloud
  REDIS_PASSWORD: z.string().min(1, {
    message: "REDIS_PASSWORD is required",
  }),
  REDIS_USERNAME: z.string().min(1, {
    message: "REDIS_USERNAME is required",
  }),
  REDIS_HOST: z.string().min(1, {
    message: "REDIS_HOST is required",
  }),
  REDIS_PORT: z.string().min(1, {
    message: "REDIS_PORT is required",
  }),
  // API Keys
  GOOGLE_BOOKS_API_KEY: z.string().min(1, {
    message: "GOOGLE_BOOKS_API_KEY is required",
  }),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({ message: "NODE_ENV must be development, production, or test" }),
  }).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
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