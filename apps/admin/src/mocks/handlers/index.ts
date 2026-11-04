import { authHandlers } from './auth'
import { canteenHandlers } from './canteen'
import { categoryHandlers } from './category'
import { dishHandlers } from './dish'
import { orderHandlers } from './order'
import { userHandlers } from './user'
import { statsHandlers } from './stats'

console.log('[Admin Handlers] auth:', authHandlers.length)
console.log('[Admin Handlers] canteen:', canteenHandlers.length)
console.log('[Admin Handlers] category:', categoryHandlers.length)
console.log('[Admin Handlers] dish:', dishHandlers.length)
console.log('[Admin Handlers] order:', orderHandlers.length)
console.log('[Admin Handlers] user:', userHandlers.length)
console.log('[Admin Handlers] stats:', statsHandlers.length)

export const handlers = [
  ...authHandlers,
  ...canteenHandlers,
  ...categoryHandlers,
  ...dishHandlers,
  ...orderHandlers,
  ...userHandlers,
  ...statsHandlers,
]

console.log('[Admin Handlers] Total handlers:', handlers.length)
