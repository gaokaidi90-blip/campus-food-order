import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

console.log('[MSW] Registering handlers:', handlers.length)
export const worker = setupWorker(...handlers)
