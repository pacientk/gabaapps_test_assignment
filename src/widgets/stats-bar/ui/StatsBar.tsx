'use client'

import { Users, UserCheck, TrendingUp, Building2 } from 'lucide-react'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { useStats } from '../model/useStats'

// ─── Skeleton ────────────────────────────────────────────────────────────────

function StatsBarSkeleton() {
  return (
    <div className="flex min-h-[72px] items-center gap-0 overflow-x-auto border-b border-gray-200 bg-white px-4 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl gap-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-[150px] flex-col gap-1.5 px-6 py-4 first:pl-0 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-gray-200"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Individual stat cell ─────────────────────────────────────────────────────

interface StatCellProps {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}

function StatCell({ label, icon, children }: StatCellProps) {
  return (
    <div className="flex min-w-[150px] flex-col justify-center gap-0.5 px-6 py-4 first:pl-0 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-gray-200">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
        {icon}
        {label}
      </p>
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Stats summary bar computed client-side from all 208 users.
 * Shows: total users, gender split, average age, top 3 departments.
 * Mobile: horizontal scroll. Skeleton while the full dataset loads.
 */
export function StatsBar() {
  const { stats, isLoading } = useStats()

  if (isLoading || !stats) return <StatsBarSkeleton />

  return (
    <div className="overflow-x-auto border-b border-gray-200 bg-white px-4 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl">

        {/* Total users */}
        <StatCell
          label="Total users"
          icon={<Users className="h-3 w-3" aria-hidden="true" />}
        >
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </StatCell>

        {/* Gender split */}
        <StatCell
          label="Gender"
          icon={<UserCheck className="h-3 w-3" aria-hidden="true" />}
        >
          <div className="flex items-baseline gap-3">
            <span className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-blue-600">{stats.maleCount}</span>
              <span className="text-xs text-gray-400">M ({stats.malePercent}%)</span>
            </span>
            <span className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-rose-500">{stats.femaleCount}</span>
              <span className="text-xs text-gray-400">F ({stats.femalePercent}%)</span>
            </span>
          </div>
        </StatCell>

        {/* Average age */}
        <StatCell
          label="Avg age"
          icon={<TrendingUp className="h-3 w-3" aria-hidden="true" />}
        >
          <p className="text-2xl font-bold text-gray-900">{stats.avgAge}</p>
        </StatCell>

        {/* Top departments */}
        <StatCell
          label="Top departments"
          icon={<Building2 className="h-3 w-3" aria-hidden="true" />}
        >
          <div className="flex flex-col gap-0.5">
            {stats.topDepartments.map(({ name, count }, i) => (
              <div key={name} className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-gray-400">#{i + 1}</span>
                <span className="truncate text-sm font-medium text-gray-700">{name}</span>
                <span className="ml-auto shrink-0 text-xs tabular-nums text-gray-400">{count}</span>
              </div>
            ))}
          </div>
        </StatCell>

      </div>
    </div>
  )
}
