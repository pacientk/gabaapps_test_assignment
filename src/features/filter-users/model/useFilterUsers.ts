'use client'

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import type { UserGender } from '@/entities/user/model/schemas'

export interface UseFilterUsersReturn {
  gender: UserGender | ''
  department: string
  setGender: (v: UserGender | '') => void
  setDepartment: (v: string) => void
  clearAll: () => void
  activeCount: number
}

/**
 * Manages gender and department filter state via URL search params.
 * URL keys: `gender`, `department`.
 * Changing any filter resets page to 1.
 */
export function useFilterUsers(): UseFilterUsersReturn {
  const [gender, setGenderRaw] = useQueryState(
    'gender',
    parseAsString.withDefault(''),
  )
  const [department, setDepartmentRaw] = useQueryState(
    'department',
    parseAsString.withDefault(''),
  )
  const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const setGender = (v: UserGender | '') => {
    void setGenderRaw(v || null)
    void setPage(null)
  }

  const setDepartment = (v: string) => {
    void setDepartmentRaw(v || null)
    void setPage(null)
  }

  const clearAll = () => {
    void setGenderRaw(null)
    void setDepartmentRaw(null)
    void setPage(null)
  }

  const activeCount = (gender ? 1 : 0) + (department ? 1 : 0)

  return {
    gender: gender as UserGender | '',
    department,
    setGender,
    setDepartment,
    clearAll,
    activeCount,
  }
}
