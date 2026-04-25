'use client'

import { useMemo } from 'react'
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

  const departments = useMemo(() => {
    if (!allUsers) return []
    return Array.from(new Set(allUsers.map((u) => u.company.department))).sort()
  }, [allUsers])

  return (
    <div className="space-y-3">
      {/* Top row: search + filters + sort */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
          isLoading={isSearching}
        />

        <FilterPanel
          gender={gender}
          department={department}
          departments={departments}
          onGenderChange={onGenderChange}
          onDepartmentChange={onDepartmentChange}
          onClearAll={onClearAllFilters}
          activeCount={activeFilterCount}
        />

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
