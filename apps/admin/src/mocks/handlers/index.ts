import { authHandlers } from './auth'
import { canteenHandlers } from './canteen'
import { categoryHandlers } from './category'

console.log('[Admin Handlers] auth:', authHandlers.length)
console.log('[Admin Handlers] canteen:', canteenHandlers.length)
console.log('[Admin Handlers] category:', categoryHandlers.length)

export const handlers = [
  ...authHandlers,
  ...canteenHandlers,
  ...categoryHandlers,
]

console.log('[Admin Handlers] Total handlers:', handlers.length)
