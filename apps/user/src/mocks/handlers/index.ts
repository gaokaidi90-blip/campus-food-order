import { authHandlers } from './auth'
import { canteenHandlers } from './canteen'
import { dishHandlers } from './dish'
import { cartHandlers } from './cart'

export const handlers = [
  ...authHandlers,
  ...canteenHandlers,
  ...dishHandlers,
  ...cartHandlers,
]


