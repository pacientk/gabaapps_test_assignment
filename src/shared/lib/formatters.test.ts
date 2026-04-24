import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatPhone,
  formatFullName,
  maskCardNumber,
  maskIban,
  truncateWallet,
} from './formatters'

describe('formatDate', () => {
  it('formats a valid ISO date string and returns non-empty string', () => {
    const result = formatDate('1996-05-30')
    expect(result).not.toBe('')
    expect(result).toMatch(/1996/)
  })

  it('formats a Date object', () => {
    // Use Date.UTC to avoid timezone ambiguity
    const result = formatDate(new Date(Date.UTC(2000, 0, 15))) // Jan 15 2000
    expect(result).toMatch(/2000/)
    expect(result).toMatch(/Jan/)
  })

  it('returns empty string for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('')
  })
})

describe('formatPhone', () => {
  it('formats a 10-digit number as (XXX) XXX-XXXX', () => {
    expect(formatPhone('9651234567')).toBe('(965) 123-4567')
  })

  it('falls back to original string for non-10-digit numbers', () => {
    const intl = '+81 965-431-3024'
    expect(formatPhone(intl)).toBe(intl)
  })
})

describe('formatFullName', () => {
  it('concatenates first and last name', () => {
    expect(formatFullName('Emily', 'Johnson')).toBe('Emily Johnson')
  })

  it('trims leading/trailing whitespace', () => {
    expect(formatFullName('', 'Johnson')).toBe('Johnson')
    expect(formatFullName('Emily', '')).toBe('Emily')
  })
})

describe('maskCardNumber', () => {
  it('masks first 12 digits, showing only last 4', () => {
    expect(maskCardNumber('9289760655481815')).toBe('**** **** **** 1815')
  })

  it('handles card numbers shorter than 16 digits', () => {
    expect(maskCardNumber('1234')).toBe('**** **** **** 1234')
  })

  it('strips non-digit characters before masking', () => {
    expect(maskCardNumber('4111 1111 1111 1234')).toBe('**** **** **** 1234')
  })
})

describe('maskIban', () => {
  it('shows first 4 and last 4 characters with **** in between', () => {
    expect(maskIban('YPUXISOBI7TTHPK2BR3HAIXL')).toBe('YPUX **** AIXL')
  })

  it('returns the original string for IBANs of 8 chars or fewer', () => {
    expect(maskIban('ABCD1234')).toBe('ABCD1234')
  })
})

describe('truncateWallet', () => {
  it('truncates long wallet addresses to first 6 + ... + last 4', () => {
    expect(truncateWallet('0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a')).toBe('0xb9fc...181a')
  })

  it('returns the original address if 12 characters or fewer', () => {
    expect(truncateWallet('0x1234567890')).toBe('0x1234567890')
  })
})
