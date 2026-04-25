'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { SearchInput } from '@/features/search-users/ui/SearchInput'
import { FilterPanel, ActiveFiltersChips } from '@/features/filter-users/ui/FilterPanel'
import { SortControls } from '@/features/sort-users/ui/SortControls'
import { useAllUsers } from '@/entities/user/model/useUsers'
import type { UserGender } from '@/entities/user/model/schemas'
import type { SortableField, SortOrder } from '@/entities/user/api/usersApi'

interface UsersFiltersProps {
  // Search
  searchValue: string
  onSearchChange: (v: string) => void
  onSearchClear: () => void
  isSearching: boolean
  // Filters
  gender: UserGender | ''
  department: string
  onGenderChange: (v: UserGender | '') => void
  onDepartmentChange: (v: string) => void
  onClearAllFilters: () => void
  activeFilterCount: number
  // Sort
  sortBy: SortableField | ''
  order: SortOrder
  onSortByChange: (field: SortableField | '') => void
  onOrderChange: (order: SortOrder) => void
  // Stats
  total: number
  showing: number
}

/**
 * Combined filter bar widget: search + filters + sort + result count.
 * Derives the department list from the full user dataset (useAllUsers).
 */
export function UsersFilters({
  searchValue,
  onSearchChange,
  onSearchClear,
  isSearching,
  gender,
  department,
  onGenderChange,
  onDepartmentChange,
  onClearAllFilters,
  activeFilterCount,
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
  total,
  showing,
}: UsersFiltersProps) {
  const { data: allUsers } = useAllUsers()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const departments = useMemo(() => {
    if (!allUsers) return []
    return Array.from(new Set(allUsers.map((u) => u.company.department))).sort()
  }, [allUsers])

  return (
    <div className="space-y-3">
      {/* Top row: search + filters toggle + sort */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search + mobile Filters toggle — always one row */}
        <div className="flex flex-1 items-center gap-2 sm:contents">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            onClear={onSearchClear}
            isLoading={isSearching}
          />

          {/* Mobile toggle button — hidden on sm+ */}
          <button
            onClick={() => setIsFiltersOpen((v) => !v)}
            aria-expanded={isFiltersOpen}
            aria-controls="filter-panel"
            className={cn(
              'flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors sm:hidden',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              isFiltersOpen || activeFilterCount > 0
                ? 'border-blue-300 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-800',
            )}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* FilterPanel: always visible on sm+, toggle on mobile */}
        <div
          id="filter-panel"
          className={cn(
            'w-full sm:contents',
            isFiltersOpen ? 'block' : 'hidden sm:contents',
          )}
        >
          <FilterPanel
            gender={gender}
            department={department}
            departments={departments}
            onGenderChange={onGenderChange}
            onDepartmentChange={onDepartmentChange}
            onClearAll={onClearAllFilters}
            activeCount={activeFilterCount}
          />
        </div>

        <div className="w-full sm:ml-auto sm:w-auto">
          <SortControls
            sortBy={sortBy}
            order={order}
            onSortByChange={onSortByChange}
            onOrderChange={onOrderChange}
          />
        </div>
      </div>

      {/* Second row: active chips + result count */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ActiveFiltersChips
          gender={gender}
          department={department}
          onRemoveGender={() => onGenderChange('')}
          onRemoveDepartment={() => onDepartmentChange('')}
          onClearAll={onClearAllFilters}
        />

        {total > 0 && (
          <p className="ml-auto text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{showing}</span>{' '}
            of <span className="font-medium text-gray-700">{total}</span> users
          </p>
        )}
      </div>
    </div>
  )
}
