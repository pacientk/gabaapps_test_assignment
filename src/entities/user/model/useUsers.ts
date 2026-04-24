import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  getUsers,
  getAllUsers,
  getUserById,
  searchUsers,
  filterUsers,
} from '../api/usersApi'
import type { SortableField, SortOrder } from '../api/usersApi'
import type { User, UsersResponse, UserGender } from './schemas'
import { userKeys } from './queryKeys'

const STALE_TIMES = {
  usersList: 1000 * 60 * 2,    // 2 min
  allUsers: 1000 * 60 * 10,    // 10 min
  userDetail: 1000 * 60 * 30,  // 30 min
} as const

export interface UseUsersParams {
  page: number
  limit: number
  search: string
  gender: UserGender | ''
  department: string
  sortBy: SortableField | ''
  order: SortOrder
}

/**
 * Primary hook for the users list page.
 * Selects the correct API endpoint based on active filters:
 * - search query → /users/search
 * - gender filter → /users/filter (server-side), then department filtered client-side
 * - no filters    → /users
 * Department is always filtered client-side after fetching.
 */
export function useUsers(params: UseUsersParams): UseQueryResult<UsersResponse> {
  const { page, limit, search, gender, department, sortBy, order } = params
  const skip = (page - 1) * limit
  const sortParams = sortBy
    ? { sortBy: sortBy as SortableField, order }
    : {}

  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async (): Promise<UsersResponse> => {
      // Search takes priority
      if (search.trim().length > 0) {
        const result = await searchUsers({ q: search, limit, skip, ...sortParams })
        if (!department) return result
        const filtered = result.users.filter(
          (u) => u.company.department === department,
        )
        return { ...result, users: filtered, total: filtered.length }
      }

      // Gender filter via API
      if (gender) {
        const result = await filterUsers({
          key: 'gender',
          value: gender,
          limit: department ? 0 : limit,
          skip: department ? 0 : skip,
          ...sortParams,
        })
        if (!department) return result
        const filtered = result.users.filter(
          (u) => u.company.department === department,
        )
        // Re-paginate client-side after department filter
        const paginated = filtered.slice(skip, skip + limit)
        return {
          ...result,
          users: paginated,
          total: filtered.length,
          skip,
          limit,
        }
      }

      // Department-only filter (client-side from full dataset)
      if (department) {
        const result = await getUsers({ limit: 0, ...sortParams })
        const filtered = result.users.filter(
          (u) => u.company.department === department,
        )
        const paginated = filtered.slice(skip, skip + limit)
        return {
          ...result,
          users: paginated,
          total: filtered.length,
          skip,
          limit,
        }
      }

      // No filters
      return getUsers({ limit, skip, ...sortParams })
    },
    staleTime: STALE_TIMES.usersList,
  })
}

/**
 * Hook for fetching all 208 users at once.
 * Used for stats computation and building the department dropdown.
 */
export function useAllUsers(): UseQueryResult<User[]> {
  return useQuery({
    queryKey: userKeys.allUsers(),
    queryFn: getAllUsers,
    staleTime: STALE_TIMES.allUsers,
  })
}

/**
 * Hook for fetching a single user's full profile (drawer).
 * Query is disabled when id is null.
 */
export function useUser(id: number | null): UseQueryResult<User> {
  return useQuery({
    queryKey: userKeys.detail(id ?? 0),
    queryFn: () => getUserById(id!),
    enabled: id !== null,
    staleTime: STALE_TIMES.userDetail,
  })
}

/**
 * Imperatively prefetches a user's detail on card hover.
 * Call with a 200ms debounce on mouseenter.
 */
export function usePrefetchUser(): (id: number) => void {
  const queryClient = useQueryClient()
  return (id: number) => {
    void queryClient.prefetchQuery({
      queryKey: userKeys.detail(id),
      queryFn: () => getUserById(id),
      staleTime: STALE_TIMES.userDetail,
    })
  }
}
