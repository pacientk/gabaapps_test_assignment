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

/**
 * Masks a payment card number, showing only the last 4 digits.
 * e.g. "4539578763621486" → "**** **** **** 1486"
 *
 * @param cardNumber - Raw card number string (digits or formatted)
 */
export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '')
  const last4 = digits.slice(-4)
  return `**** **** **** ${last4}`
}

/**
 * Masks an IBAN, showing only the first 4 and last 4 characters.
 * e.g. "GB82WEST12345698765432" → "GB82 **** 5432"
 *
 * @param iban - Raw IBAN string
 */
export function maskIban(iban: string): string {
  const clean = iban.replace(/\s/g, '')
  if (clean.length <= 8) return iban
  return `${clean.slice(0, 4)} **** ${clean.slice(-4)}`
}

/**
 * Truncates a crypto wallet address: first 6 chars + "..." + last 4 chars.
 * e.g. "0x93d8cBB4..." → "0x93d8...cBB4"
 *
 * @param address - Full wallet address string
 */
export function truncateWallet(address: string): string {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
