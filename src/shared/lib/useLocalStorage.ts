'use client'

import { useState } from 'react'

/**
 * useState backed by localStorage for simple persistent client-side preferences.
 * Falls back to `initialValue` if localStorage is unavailable or value is missing.
 *
 * @param key - localStorage key
 * @param initialValue - default value when key is absent
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T) => {
    setStoredValue(value)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // localStorage unavailable (e.g. Safari private mode)
      }
    }
  }

  return [storedValue, setValue]
}
