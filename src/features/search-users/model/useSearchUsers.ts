'use client'

import { useEffect, useState } from 'react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

export interface UseSearchUsersReturn {
  /** Current value shown in the input (immediate) */
  inputValue: string
  /** Debounced value synced to URL — used for API calls */
  urlSearch: string
  setInputValue: (v: string) => void
  clearSearch: () => void
}

/**
 * Manages search state with a 300ms debounce between the input and the URL.
 * - Typing updates `inputValue` immediately for responsive UX
 * - After 300ms of inactivity the URL param `search` is updated
 * - Changing search resets `page` to 1
 */
export function useSearchUsers(): UseSearchUsersReturn {
  const [urlSearch, setUrlSearch] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )
  const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const [inputValue, setInputValue] = useState(urlSearch)

  // Sync input when URL changes externally (browser back/forward)
  useEffect(() => {
    if (urlSearch !== inputValue) {
      setInputValue(urlSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch])

  // Debounce input → URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = inputValue.trim()
      void setUrlSearch(trimmed || null)
      void setPage(null)
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])

  const clearSearch = () => {
    setInputValue('')
    void setUrlSearch(null)
    void setPage(null)
  }

  return { inputValue, urlSearch, setInputValue, clearSearch }
}
