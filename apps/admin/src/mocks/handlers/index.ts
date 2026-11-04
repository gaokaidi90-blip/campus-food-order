import { authHandlers } from './auth'
import { canteenHandlers } from './canteen'

console.log('[Admin Handlers] auth:', authHandlers.length)
console.log('[Admin Handlers] canteen:', canteenHandlers.length)

export const handlers = [
  ...authHandlers,
  ...canteenHandlers,
]

console.log('[Admin Handlers] Total handlers:', handlers.length)
