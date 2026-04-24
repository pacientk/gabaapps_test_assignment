'use client'

import { memo, useRef } from 'react'
import { Mail, MapPin } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { formatFullName } from '@/shared/lib/formatters'
import { usePrefetchUser } from '../model/useUsers'
import type { User } from '../model/schemas'
import { UserAvatar } from './UserAvatar'
import { UserBadge } from './UserBadge'

interface UserCardProps {
  user: User
  onClick: (userId: number) => void
  isSelected?: boolean
}

/**
 * Card component for the users grid.
 * Keyboard-accessible (Enter/Space). Prefetches user detail on hover (200ms delay).
 */
export const UserCard = memo(function UserCard({ user, onClick, isSelected = false }: UserCardProps) {
  const fullName = formatFullName(user.firstName, user.lastName)
  const prefetchUser = usePrefetchUser()
  const prefetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    prefetchTimer.current = setTimeout(() => prefetchUser(user.id), 200)
  }

  const handleMouseLeave = () => {
    if (prefetchTimer.current) {
      clearTimeout(prefetchTimer.current)
      prefetchTimer.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(user.id)
    }
  }

  return (
    <article
      data-testid="user-card"
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onClick(user.id)}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'cursor-pointer rounded-xl border bg-white p-4 transition-all duration-150 ease-out',
        'hover:border-blue-300 hover:shadow-md hover:scale-[1.01]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-100'
          : 'border-gray-200 shadow-sm',
      )}
    >
      {/* Top row: avatar + name + badge */}
      <div className="flex items-start gap-3">
        <UserAvatar src={user.image} name={fullName} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-base font-semibold text-gray-900">
              {fullName}
            </p>
            <UserBadge role={user.role} />
          </div>
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {user.company.title}
          </p>
        </div>
      </div>

      {/* Department · Company */}
      <p className="mt-3 truncate text-sm text-gray-400">
        {user.company.department}
        <span className="mx-1.5 text-gray-300">·</span>
        {user.company.name}
      </p>

      {/* Email */}
      <p className="mt-1.5 flex items-center gap-1.5 truncate text-sm text-gray-500">
        <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
        {user.email}
      </p>

      {/* Location */}
      <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
        {user.address.city}, {user.address.country}
      </p>
    </article>
  )
})
