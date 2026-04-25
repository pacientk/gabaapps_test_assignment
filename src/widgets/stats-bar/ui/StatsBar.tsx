'use client'

import { Users, UserCheck, TrendingUp, Building2 } from 'lucide-react'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'
import { useStats } from '../model/useStats'

// ─── Skeleton ────────────────────────────────────────────────────────────────

function StatsBarSkeleton() {
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-4 sm:px-8 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Individual stat card ─────────────────────────────────────────────────────

interface StatCellProps {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}

function StatCell({ label, icon, children }: StatCellProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-800">
        {icon}
        {label}
      </p>
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Stats summary computed client-side from all 208 users.
 * Shows: total users, gender split, average age, top 3 departments.
 * Renders as a 4-card grid (2-col mobile, 4-col desktop). Skeleton while loading.
 */
export function StatsBar() {
  const { stats, isLoading } = useStats()

  if (isLoading || !stats) return <StatsBarSkeleton />

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-4 sm:px-8 lg:grid-cols-4">

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
          <div className="flex items-baseline gap-6">
            <span className="flex flex-col items-baseline">
              <span className="text-2xl font-semibold text-gray-900">M:{'\u00A0'}{stats.maleCount}</span>
              <span className="text-sm text-gray-600">({stats.malePercent}%)</span>
            </span>
            <span className="flex flex-col items-baseline">
              <span className="text-2xl font-semibold text-gray-900">F:{'\u00A0'}{stats.femaleCount}</span>
              <span className="text-sm text-gray-600">({stats.femalePercent}%)</span>
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
