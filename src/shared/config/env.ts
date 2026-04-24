import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default('https://dummyjson.com'),
})

/**
 * Validated environment variables.
 * Throws a ZodError at startup if required vars are missing or malformed.
 */
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
