/**
 * Formats a date string or Date object to a human-readable locale string.
 *
 * @param value - ISO date string or Date object
 * @param locale - BCP 47 locale tag (default: 'en-US')
 * @returns Formatted date string, or empty string on invalid input
 */
export function formatDate(value: string | Date, locale = 'en-US'): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Formats a phone number string to (XXX) XXX-XXXX if 10 digits are found.
 * Falls back to the original string for other formats.
 *
 * @param phone - Raw phone string
 * @returns Formatted phone string
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

/**
 * Formats a full name from first and last name parts.
 *
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Full name string
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}
