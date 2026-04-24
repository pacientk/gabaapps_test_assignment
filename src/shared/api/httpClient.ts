import { ApiError } from '@/shared/types/api'
import { logger } from '@/shared/lib/logger'
import { env } from '@/shared/config/env'

const BASE_URL = env.NEXT_PUBLIC_API_URL

/**
 * Serializes a params object into a URL query string.
 * Skips undefined/empty-string values.
 */
function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== '',
  )
  if (entries.length === 0) return ''
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
}

/**
 * Base HTTP client that wraps fetch with uniform error handling.
 * All API calls should go through this client.
 *
 * @param path - URL path relative to BASE_URL (e.g. '/users')
 * @param params - Optional query parameters (undefined values are omitted)
 * @param init - Standard RequestInit options
 * @returns Parsed JSON response
 * @throws {ApiError} On non-2xx HTTP status or network failure
 */
export async function httpClient<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  init?: RequestInit,
): Promise<T> {
  const qs = params ? buildQueryString(params) : ''
  const url = `${BASE_URL}${path}${qs}`

  let response: Response
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    })
  } catch (cause) {
    logger.error('Network error', url, cause)
    throw new ApiError('Network error — please check your connection', 0, 'NETWORK_ERROR')
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    logger.error('HTTP error', response.status, url, text)

    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      404: 'NOT_FOUND',
      429: 'RATE_LIMITED',
      500: 'SERVER_ERROR',
    }
    const code = codeMap[response.status] ?? 'SERVER_ERROR'
    throw new ApiError(`Request failed: ${response.statusText}`, response.status, code)
  }

  const json = (await response.json()) as T
  return json
}
