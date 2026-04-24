import { ApiError } from '@/shared/types/api'
import { logger } from '@/shared/lib/logger'

const BASE_URL = 'https://dummyjson.com'

/**
 * Base HTTP client that wraps fetch with uniform error handling.
 * All API calls should go through this client.
 *
 * @param path - URL path relative to BASE_URL (e.g. '/users')
 * @param init - Standard RequestInit options
 * @returns Parsed JSON response
 * @throws {ApiError} On non-2xx HTTP status or network failure
 */
export async function httpClient<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path}`

  let response: Response
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    })
  } catch (cause) {
    logger.error('Network error', url, cause)
    throw new ApiError('Network error — please check your connection', 0)
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    logger.error('HTTP error', response.status, url, text)
    throw new ApiError(
      `Request failed: ${response.statusText}`,
      response.status,
    )
  }

  const json = (await response.json()) as T
  return json
}
