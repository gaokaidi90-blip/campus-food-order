import { authHandlers } from './auth'

console.log('[Admin Handlers] auth:', authHandlers.length)

export const handlers = [
  ...authHandlers,
]

console.log('[Admin Handlers] Total handlers:', handlers.length)
