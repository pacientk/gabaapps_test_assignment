import { cn } from '@/shared/lib/cn'
import type { UserRole } from '../model/schemas'

interface UserBadgeProps {
  role: UserRole
  className?: string
}

const ROLE_STYLES: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700',
  moderator: 'bg-amber-100 text-amber-700',
  user: 'bg-gray-100 text-gray-600',
}

/**
 * Displays a styled role badge for a user.
 */
export function UserBadge({ role, className }: UserBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        ROLE_STYLES[role],
        className,
      )}
    >
      {role}
    </span>
  )
}
