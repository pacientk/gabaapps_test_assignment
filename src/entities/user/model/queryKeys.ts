import type { UseUsersParams } from './useUsers'

/**
 * Centralised query key factory for all user-related queries.
 * Ensures consistent cache invalidation and devtools labelling.
 */
export const userKeys = {
  all: ['users'] as const,

  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UseUsersParams) => [...userKeys.lists(), params] as const,

  allUsers: () => [...userKeys.all, 'all'] as const,

  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
} as const
