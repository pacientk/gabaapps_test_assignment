'use client'

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { SORT_FIELDS } from '../model/useSortUsers'
import type { SortableField, SortOrder } from '@/entities/user/api/usersApi'

interface SortControlsProps {
  sortBy: SortableField | ''
  order: SortOrder
  onSortByChange: (field: SortableField | '') => void
  onOrderChange: (order: SortOrder) => void
}

/**
 * Sort controls for the card view:
 * a "Sort by" dropdown and an asc/desc toggle button.
 */
export function SortControls({
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
}: SortControlsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <select
        id="sort-by"
        name="sortBy"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as SortableField | '')}
        aria-label="Sort by field"
        className="h-9 rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Sort by…</option>
        {SORT_FIELDS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onOrderChange(order === 'asc' ? 'desc' : 'asc')}
        disabled={!sortBy}
        aria-label={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          !sortBy
            ? 'cursor-not-allowed text-gray-300 opacity-50'
            : 'text-gray-500 hover:border-gray-300 hover:text-gray-700',
        )}
      >
        {order === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}

// ─── Column header sort button (for table view) ───────────────────────────────

interface SortableColumnProps {
  field: SortableField
  label: string
  currentSortBy: SortableField | ''
  currentOrder: SortOrder
  onClick: (field: SortableField) => void
}

/**
 * Clickable table column header with sort direction indicator.
 */
export function SortableColumn({
  field,
  label,
  currentSortBy,
  currentOrder,
  onClick,
}: SortableColumnProps) {
  const isActive = currentSortBy === field
  return (
    <button
      onClick={() => onClick(field)}
      className={cn(
        'flex items-center gap-1 text-left text-xs font-medium uppercase tracking-wide',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600',
      )}
    >
      {label}
      {isActive ? (
        currentOrder === 'asc' ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-30" />
      )}
    </button>
  )
}
