/**
 * Generic API response wrapper for single-resource endpoints.
 *
 * @template T - The shape of the data payload
 */
export interface ApiResponse<T> {
  data: T
}

/**
 * Generic paginated API response matching dummyjson.com pagination shape.
 *
 * @template T - The shape of each item in the list
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  users: T[]
  /** Total number of items across all pages */
  total: number
  /** Number of items skipped (offset) */
  skip: number
  /** Maximum items per page */
  limit: number
}

/**
 * Typed API error thrown by the HTTP client and API layer.
 */
export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
