'use client'

import { parseAsInteger, useQueryState } from 'nuqs'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number]

export { PAGE_SIZE_OPTIONS }

export interface UsePaginationReturn {
  page: number
  limit: PageSizeOption
  setPage: (page: number) => void
  setLimit: (limit: PageSizeOption) => void
  reset: () => void
}

/**
 * Manages pagination state via URL search params (nuqs).
 * URL keys: `page` (default: 1), `limit` (default: 10).
 */
export function usePagination(): UsePaginationReturn {
  const [page, setPageRaw] = useQueryState(
    'page',
    parseAsInteger.withDefault(1),
  )
  const [limit, setLimitRaw] = useQueryState(
    'limit',
    parseAsInteger.withDefault(10),
  )

  const safeLimit = (PAGE_SIZE_OPTIONS as readonly number[]).includes(limit)
    ? (limit as PageSizeOption)
    : 10

  const setPage = (p: number) => {
    void setPageRaw(p <= 1 ? null : p)
  }

  const setLimit = (l: PageSizeOption) => {
    void setLimitRaw(l === 10 ? null : l)
    void setPageRaw(null) // reset to page 1
  }

  const reset = () => {
    void setPageRaw(null)
    void setLimitRaw(null)
  }

  return { page, limit: safeLimit, setPage, setLimit, reset }
}
