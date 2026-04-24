import { httpClient } from '@/shared/api/httpClient'
import { ApiError } from '@/shared/types/api'
import { UserSchema, UsersResponseSchema } from '../model/schemas'
import type { User, UsersResponse } from '../model/schemas'

export type SortableField =
  | 'firstName'
  | 'lastName'
  | 'age'
  | 'email'
  | 'company.name'

export type SortOrder = 'asc' | 'desc'

export interface GetUsersParams {
  limit?: number
  skip?: number
  sortBy?: SortableField
  order?: SortOrder
}

export interface SearchUsersParams extends GetUsersParams {
  q: string
}

export interface FilterUsersParams extends GetUsersParams {
  key: string
  value: string
}

/**
 * Fetches a paginated, optionally sorted list of users.
 */
export async function getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
  const { limit = 10, skip = 0, sortBy, order } = params
  const raw = await httpClient<unknown>('/users', {
    limit,
    skip,
    sortBy,
    order,
  })
  const result = UsersResponseSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError('Invalid API response shape', 0, 'PARSE_ERROR')
  }
  return result.data
}

/**
 * Fetches all 208 users in a single request (used for stats and department list).
 */
export async function getAllUsers(): Promise<User[]> {
  const raw = await httpClient<unknown>('/users', { limit: 0 })
  const result = UsersResponseSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError('Invalid API response shape', 0, 'PARSE_ERROR')
  }
  return result.data.users
}

/**
 * Fetches a single user by ID.
 */
export async function getUserById(id: number): Promise<User> {
  const raw = await httpClient<unknown>(`/users/${id}`)
  const result = UserSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError('Invalid API response shape', 0, 'PARSE_ERROR')
  }
  return result.data
}

/**
 * Searches users by a query string.
 * Combines with sort params; falls back to getUsers when q is empty.
 */
export async function searchUsers(params: SearchUsersParams): Promise<UsersResponse> {
  const { q, limit = 10, skip = 0, sortBy, order } = params
  const raw = await httpClient<unknown>('/users/search', {
    q,
    limit,
    skip,
    sortBy,
    order,
  })
  const result = UsersResponseSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError('Invalid API response shape', 0, 'PARSE_ERROR')
  }
  return result.data
}

/**
 * Filters users by a key/value pair (e.g. gender=female).
 */
export async function filterUsers(params: FilterUsersParams): Promise<UsersResponse> {
  const { key, value, limit = 10, skip = 0, sortBy, order } = params
  const raw = await httpClient<unknown>('/users/filter', {
    key,
    value,
    limit,
    skip,
    sortBy,
    order,
  })
  const result = UsersResponseSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError('Invalid API response shape', 0, 'PARSE_ERROR')
  }
  return result.data
}
