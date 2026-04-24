'use client'

import { cn } from '@/shared/lib/cn'
import { formatFullName } from '@/shared/lib/formatters'
import type { User } from '@/entities/user/model/schemas'
import { UserAvatar } from '@/entities/user/ui/UserAvatar'
import { UserBadge } from '@/entities/user/ui/UserBadge'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'

interface UsersTableProps {
  users: User[]
  isLoading?: boolean
  selectedUserId: number | null
  onRowClick: (userId: number) => void
}

const COLUMNS = ['User', 'Age', 'Gender', 'Department', 'Company', 'Email', 'City'] as const

/**
 * Table view of the users list.
 * Shows: avatar, name, age, gender, department, company, email, city.
 */
export function UsersTable({
  users,
  isLoading = false,
  selectedUserId,
  onRowClick,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </td>
                  {Array.from({ length: COLUMNS.length - 1 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))
            : users.map((user) => {
                const fullName = formatFullName(user.firstName, user.lastName)
                const isSelected = user.id === selectedUserId
                return (
                  <tr
                    key={user.id}
                    onClick={() => onRowClick(user.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onRowClick(user.id)
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    className={cn(
                      'cursor-pointer border-b border-gray-100 transition-colors last:border-0',
                      'hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
                      isSelected && 'bg-blue-50',
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar src={user.image} name={fullName} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900">{fullName}</p>
                          <UserBadge role={user.role} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.age}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{user.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{user.company.department}</td>
                    <td className="px-4 py-3 text-gray-600">{user.company.name}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500">{user.address.city}</td>
                  </tr>
                )
              })}
        </tbody>
      </table>
    </div>
  )
}
