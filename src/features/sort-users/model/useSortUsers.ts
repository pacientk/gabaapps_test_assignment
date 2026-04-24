'use client'

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import type { SortableField, SortOrder } from '@/entities/user/api/usersApi'

export interface UseSortUsersReturn {
  sortBy: SortableField | ''
  order: SortOrder
  setSortBy: (field: SortableField | '') => void
  setOrder: (order: SortOrder) => void
  toggleSort: (field: SortableField) => void
  clearSort: () => void
}

/**
 * Manages sort state via URL search params.
 * URL keys: `sortBy`, `order` (default: 'asc').
 * `toggleSort` — clicking the same field toggles asc/desc; a new field resets to asc.
 * Changing sort resets page to 1.
 */
export function useSortUsers(): UseSortUsersReturn {
  const [sortBy, setSortByRaw] = useQueryState(
    'sortBy',
    parseAsString.withDefault(''),
  )
  const [order, setOrderRaw] = useQueryState(
    'order',
    parseAsString.withDefault('asc'),
  )
  const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const setSortBy = (field: SortableField | '') => {
    void setSortByRaw(field || null)
    void setPage(null)
  }

  const setOrder = (o: SortOrder) => {
    void setOrderRaw(o === 'asc' ? null : o)
    void setPage(null)
  }

  const toggleSort = (field: SortableField) => {
    if (sortBy === field) {
      const next: SortOrder = order === 'asc' ? 'desc' : 'asc'
      void setOrderRaw(next === 'asc' ? null : next)
    } else {
      void setSortByRaw(field)
      void setOrderRaw(null) // reset to asc
    }
    void setPage(null)
  }

  const clearSort = () => {
    void setSortByRaw(null)
    void setOrderRaw(null)
    void setPage(null)
  }

  return {
    sortBy: sortBy as SortableField | '',
    order: (order === 'desc' ? 'desc' : 'asc') as SortOrder,
    setSortBy,
    setOrder,
    toggleSort,
    clearSort,
  }
}

// ─── Sort field display names ─────────────────────────────────────────────────

export const SORT_FIELDS: { value: SortableField; label: string }[] = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'age', label: 'Age' },
  { value: 'email', label: 'Email' },
  { value: 'company.name', label: 'Company' },
]
