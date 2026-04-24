import { cn } from '@/shared/lib/cn'

interface SkeletonProps {
  className?: string
}

/**
 * Pulsing placeholder block for loading states.
 * Compose multiple instances to mimic the target layout.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      aria-hidden="true"
    />
  )
}
