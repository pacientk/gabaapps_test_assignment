const isProd = process.env.NODE_ENV === 'production'

/**
 * Thin logger utility.
 * All methods are no-ops in production to prevent console leaks.
 */
export const logger = {
  /** Log informational message (dev only) */
  info: (...args: unknown[]): void => {
    if (!isProd) console.info('[INFO]', ...args)
  },
  /** Log warning message (dev only) */
  warn: (...args: unknown[]): void => {
    if (!isProd) console.warn('[WARN]', ...args)
  },
  /** Log error message (always shown) */
  error: (...args: unknown[]): void => {
    console.error('[ERROR]', ...args)
  },
  /** Log debug message (dev only) */
  debug: (...args: unknown[]): void => {
    if (!isProd) console.debug('[DEBUG]', ...args)
  },
}
