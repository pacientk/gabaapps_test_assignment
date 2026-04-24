'use client'

import { useEffect } from 'react'
import { LayoutGrid, List, AlertTriangle, SearchX } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { cn } from '@/shared/lib/cn'
import { useUsers } from '@/entities/user/model/useUsers'
import { UserCard } from '@/entities/user/ui/UserCard'
import { UserCardSkeleton } from '@/entities/user/ui/UserCardSkeleton'
import { Pagination } from '@/features/paginate-users/ui/Pagination'
import { usePagination } from '@/features/paginate-users/model/usePagination'
import { useSearchUsers } from '@/features/search-users/model/useSearchUsers'
import { useFilterUsers } from '@/features/filter-users/model/useFilterUsers'
import { useSortUsers } from '@/features/sort-users/model/useSortUsers'
import { UsersFilters } from '@/widgets/users-filters/ui/UsersFilters'
import { UsersTable } from '@/widgets/users-table/ui/UsersTable'
import { UserDrawer } from '@/widgets/user-drawer/ui/UserDrawer'
import { useDrawerStore } from '@/widgets/user-drawer/model/useDrawerStore'
import { StatsBar } from '@/widgets/stats-bar/ui/StatsBar'
import { useLocalStorage } from '@/shared/lib/useLocalStorage'

/**
 * Main users list page composition.
 * Assembles all feature hooks and wires them to useUsers + UI components.
 * Drawer state: Zustand (immediate) + nuqs URL (?userId=) for deep-linking.
 */
export function UsersPage() {
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'table'>('users-view', 'grid')

  // Drawer: Zustand store (immediate UI state)
  const { selectedUserId, openDrawer, closeDrawer } = useDrawerStore()

  // Drawer: URL sync (?userId=)
  const [urlUserId, setUrlUserId] = useQueryState(
    'userId',
    parseAsInteger,
  )

  // On mount: if ?userId is in URL, open the drawer
  useEffect(() => {
    if (urlUserId !== null && selectedUserId === null) {
      openDrawer(urlUserId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenDrawer = (id: number) => {
    openDrawer(id)
    void setUrlUserId(id)
  }

  const handleCloseDrawer = () => {
    closeDrawer()
    void setUrlUserId(null)
  }

  // Pagination
  const { page, limit, setPage, setLimit } = usePagination()

  // Search
  const { inputValue, urlSearch, setInputValue, clearSearch } = useSearchUsers()

  // Filters
  const {
    gender,
    department,
    setGender,
    setDepartment,
    clearAll: clearAllFilters,
    activeCount: activeFilterCount,
  } = useFilterUsers()

  // Sort
  const { sortBy, order, setSortBy, setOrder, toggleSort } = useSortUsers()

  const { data, isLoading, isError, isFetching, refetch } = useUsers({
    page,
    limit,
    search: urlSearch,
    gender,
    department,
    sortBy,
    order,
  })

  const users = data?.users ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  const handlePageChange = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearAll = () => {
    clearSearch()
    clearAllFilters()
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Page header */}
        <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>

              {/* View toggle */}
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={cn(
                    'rounded-md p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600',
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  aria-label="Table view"
                  aria-pressed={viewMode === 'table'}
                  className={cn(
                    'rounded-md p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600',
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <StatsBar />

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">

          {/* Filter bar */}
          <div className="mb-6">
            <UsersFilters
              searchValue={inputValue}
              onSearchChange={setInputValue}
              onSearchClear={clearSearch}
              isSearching={isFetching && !!urlSearch}
              gender={gender}
              department={department}
              onGenderChange={setGender}
              onDepartmentChange={setDepartment}
              onClearAllFilters={handleClearAll}
              activeFilterCount={activeFilterCount}
              sortBy={sortBy}
              order={order}
              onSortByChange={setSortBy}
              onOrderChange={setOrder}
              total={total}
              showing={users.length}
            />
          </div>

          {/* Error state */}
          {isError && (
            <div
              role="alert"
              className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 py-16 text-center"
            >
              <AlertTriangle className="h-10 w-10 text-red-400" />
              <p className="text-lg font-semibold text-gray-800">Failed to load users</p>
              <p className="text-sm text-gray-500">Something went wrong. Please try again.</p>
              <button
                onClick={() => void refetch()}
                className="mt-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && users.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <SearchX className="h-10 w-10 text-gray-300" />
              <p className="text-lg font-semibold text-gray-800">No users found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              <button
                onClick={handleClearAll}
                className="mt-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' && !isError && (
            <div aria-busy={isLoading} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading
                ? Array.from({ length: limit }).map((_, i) => <UserCardSkeleton key={i} />)
                : users.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      isSelected={user.id === selectedUserId}
                      onClick={handleOpenDrawer}
                    />
                  ))}
            </div>
          )}

          {/* Table view */}
          {viewMode === 'table' && !isError && (
            <UsersTable
              users={users}
              isLoading={isLoading}
              selectedUserId={selectedUserId}
              onRowClick={handleOpenDrawer}
              sortBy={sortBy}
              order={order}
              onSort={toggleSort}
            />
          )}

          {/* Pagination */}
          {!isLoading && !isError && users.length > 0 && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={setLimit}
              />
            </div>
          )}
        </div>
      </div>

      {/* User detail drawer */}
      <UserDrawer userId={selectedUserId} onClose={handleCloseDrawer} />
    </>
  )
}
