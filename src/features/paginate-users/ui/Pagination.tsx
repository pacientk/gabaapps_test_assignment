'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { PAGE_SIZE_OPTIONS, type PageSizeOption } from '../model/usePagination'

interface PaginationProps {
  page: number
  totalPages: number
  limit: PageSizeOption
  onPageChange: (page: number) => void
  onLimitChange: (limit: PageSizeOption) => void
}

/** Max visible page buttons on each side of current page */
const SIBLING_COUNT = 1

function getPageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const left = Math.max(2, current - SIBLING_COUNT)
  const right = Math.min(total - 1, current + SIBLING_COUNT)

  const showLeftDots = left > 2
  const showRightDots = right < total - 1

  const pages: (number | '...')[] = [1]
  if (showLeftDots) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (showRightDots) pages.push('...')
  pages.push(total)

  return pages
}

/**
 * Full pagination control with page buttons, prev/next, first/last,
 * and a page-size selector.
 * Desktop: full layout. Mobile: simplified prev/next + label.
 */
export function Pagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageRange(page, totalPages)

  const btnBase =
    'flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
  const btnActive = 'bg-blue-600 text-white'
  const btnDefault = 'text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3">
      {/* Page buttons — hidden on mobile */}
      <div className="hidden items-center gap-1 sm:flex">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
          className={cn(btnBase, btnDefault)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={cn(btnBase, btnDefault)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-1 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={cn(btnBase, p === page ? btnActive : btnDefault)}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={cn(btnBase, btnDefault)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Last page"
          className={cn(btnBase, btnDefault)}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile: simplified */}
      <div className="flex items-center gap-2 sm:hidden">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={cn(btnBase, btnDefault, 'gap-1')}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(btnBase, btnDefault, 'gap-1')}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Right side: page-size selector + label */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="hidden sm:block">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <label htmlFor="page-size" className="text-xs text-gray-400">
            Rows
          </label>
          <select
            id="page-size"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value) as PageSizeOption)}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  )
}
