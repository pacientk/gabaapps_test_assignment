'use client'

import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { UserGender } from '@/entities/user/model/schemas'

interface FilterPanelProps {
  gender: UserGender | ''
  department: string
  departments: string[]
  onGenderChange: (v: UserGender | '') => void
  onDepartmentChange: (v: string) => void
  onClearAll: () => void
  activeCount: number
}

const GENDER_OPTIONS: { value: UserGender | ''; label: string }[] = [
  { value: '', label: 'All genders' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

const selectClass = cn(
  'h-9 rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700',
  'focus:outline-none focus:ring-2 focus:ring-blue-500',
  'transition-colors',
)

/**
 * Filter controls for gender and department.
 * Desktop: horizontal dropdowns. Mobile: same layout, full-width.
 */
export function FilterPanel({
  gender,
  department,
  departments,
  onGenderChange,
  onDepartmentChange,
  onClearAll,
  activeCount,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Gender */}
      <select
        id="filter-gender"
        name="gender"
        value={gender}
        onChange={(e) => onGenderChange(e.target.value as UserGender | '')}
        aria-label="Filter by gender"
        className={selectClass}
      >
        {GENDER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Department */}
      <select
        id="filter-department"
        name="department"
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
        aria-label="Filter by department"
        className={selectClass}
      >
        <option value="">All departments</option>
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Clear all — shown only when filters are active */}
      {activeCount > 0 && (
        <button
          onClick={onClearAll}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
          <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
            {activeCount}
          </span>
        </button>
      )}
    </div>
  )
}

// ─── Active filter chips ──────────────────────────────────────────────────────

interface ActiveFiltersChipsProps {
  gender: UserGender | ''
  department: string
  onRemoveGender: () => void
  onRemoveDepartment: () => void
  onClearAll: () => void
}

/**
 * Chips displayed below the filter bar showing active filters.
 * Returns null when no filters are active.
 */
export function ActiveFiltersChips({
  gender,
  department,
  onRemoveGender,
  onRemoveDepartment,
  onClearAll,
}: ActiveFiltersChipsProps) {
  if (!gender && !department) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {gender && (
        <Chip label={gender === 'male' ? '♂ Male' : '♀ Female'} onRemove={onRemoveGender} />
      )}
      {department && (
        <Chip label={`🏢 ${department}`} onRemove={onRemoveDepartment} />
      )}
      <button
        onClick={onClearAll}
        className="text-xs text-gray-400 underline-offset-2 hover:text-gray-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Clear all
      </button>
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex animate-in fade-in items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 duration-150">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="ml-0.5 rounded-full p-0.5 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
