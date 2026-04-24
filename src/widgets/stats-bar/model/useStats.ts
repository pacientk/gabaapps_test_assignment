import { useMemo } from 'react'
import { useAllUsers } from '@/entities/user/model/useUsers'
import type { UseQueryResult } from '@tanstack/react-query'
import type { User } from '@/entities/user/model/schemas'

export interface DepartmentStat {
  name: string
  count: number
}

export interface UserStats {
  total: number
  maleCount: number
  femaleCount: number
  malePercent: number
  femalePercent: number
  avgAge: number
  topDepartments: DepartmentStat[]
}

export interface UseStatsReturn {
  stats: UserStats | null
  isLoading: boolean
  isError: boolean
}

function computeStats(users: User[]): UserStats {
  const total = users.length
  if (total === 0) {
    return {
      total: 0,
      maleCount: 0,
      femaleCount: 0,
      malePercent: 0,
      femalePercent: 0,
      avgAge: 0,
      topDepartments: [],
    }
  }

  const maleCount = users.filter((u) => u.gender === 'male').length
  const femaleCount = users.filter((u) => u.gender === 'female').length
  const avgAge =
    Math.round(
      (users.reduce((sum, u) => sum + u.age, 0) / total) * 10,
    ) / 10

  const deptCounts = users.reduce<Record<string, number>>((acc, u) => {
    const dept = u.company.department
    acc[dept] = (acc[dept] ?? 0) + 1
    return acc
  }, {})

  const topDepartments = Object.entries(deptCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }))

  return {
    total,
    maleCount,
    femaleCount,
    malePercent: Math.round((maleCount / total) * 100),
    femalePercent: Math.round((femaleCount / total) * 100),
    avgAge,
    topDepartments,
  }
}

/**
 * Computes aggregate stats from the full user dataset (208 users).
 * Memoised — recomputed only when the data reference changes.
 */
export function useStats(): UseStatsReturn {
  const { data, isLoading, isError }: UseQueryResult<User[]> = useAllUsers()

  const stats = useMemo(
    () => (data ? computeStats(data) : null),
    [data],
  )

  return { stats, isLoading, isError }
}
