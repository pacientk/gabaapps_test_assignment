'use client'

import { Search, X, Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  isLoading?: boolean
}

/**
 * Search input with left icon, loading spinner, and clear (×) button.
 * Full-width on mobile, 320px on desktop.
 */
export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search users…',
  isLoading = false,
}: SearchInputProps) {
  return (
    <div role="search" className="relative w-full min-[776px]:w-80">
      {/* Left icon */}
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />

      <input
        type="text"
        aria-label="Search users"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm text-gray-900',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'transition-colors',
        )}
      />

      {/* Right side: spinner or clear button */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <Loader2
            className="h-4 w-4 animate-spin text-gray-400"
            aria-hidden="true"
          />
        ) : value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="flex items-center justify-center rounded-full p-0.5 text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
