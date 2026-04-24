'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/shared/lib/cn'

export type AvatarSize = 'sm' | 'md' | 'lg'

interface UserAvatarProps {
  src: string
  name: string
  size?: AvatarSize
}

const SIZE_MAP: Record<AvatarSize, { px: number; className: string }> = {
  sm: { px: 32, className: 'h-8 w-8 text-xs' },
  md: { px: 48, className: 'h-12 w-12 text-sm' },
  lg: { px: 80, className: 'h-20 w-20 text-xl' },
}

/** Deterministic color from name — stable across renders */
function getInitialsColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-violet-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return colors[Math.abs(hash) % colors.length] ?? 'bg-blue-500'
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts[1]?.[0] ?? ''
  return (first + last).toUpperCase()
}

/**
 * Displays a user avatar with Next.js Image optimisation.
 * Falls back to coloured initials circle on image load error.
 */
export function UserAvatar({ src, name, size = 'md' }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const { px, className } = SIZE_MAP[size]
  const bgColor = getInitialsColor(name)

  if (imgError) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
          bgColor,
          className,
        )}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-full', className)}>
      <Image
        src={src}
        alt={name}
        width={px}
        height={px}
        className="h-full w-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
