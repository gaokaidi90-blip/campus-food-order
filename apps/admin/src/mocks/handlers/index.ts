import { authHandlers } from './auth'
import { canteenHandlers } from './canteen'
import { categoryHandlers } from './category'
import { dishHandlers } from './dish'

console.log('[Admin Handlers] auth:', authHandlers.length)
console.log('[Admin Handlers] canteen:', canteenHandlers.length)
console.log('[Admin Handlers] category:', categoryHandlers.length)
console.log('[Admin Handlers] dish:', dishHandlers.length)

export const handlers = [
  ...authHandlers,
  ...canteenHandlers,
  ...categoryHandlers,
  ...dishHandlers,
]

console.log('[Admin Handlers] Total handlers:', handlers.length)
