import { authHandlers } from './auth'
import { canteenHandlers } from './canteen'
import { dishHandlers } from './dish'
import { cartHandlers } from './cart'
import { addressHandlers } from './address'
import { orderHandlers } from './order'

console.log('[Handlers] auth:', authHandlers.length)
console.log('[Handlers] canteen:', canteenHandlers.length)
console.log('[Handlers] dish:', dishHandlers.length)
console.log('[Handlers] cart:', cartHandlers.length)
console.log('[Handlers] address:', addressHandlers.length)
console.log('[Handlers] order:', orderHandlers.length)

export const handlers = [
  ...authHandlers,
  ...canteenHandlers,
  ...dishHandlers,
  ...cartHandlers,
  ...addressHandlers,
  ...orderHandlers,
]

console.log('[Handlers] Total handlers:', handlers.length)


