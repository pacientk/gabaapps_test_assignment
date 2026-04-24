import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/** MSW Node.js server instance for unit/integration tests */
export const server = setupServer(...handlers)
