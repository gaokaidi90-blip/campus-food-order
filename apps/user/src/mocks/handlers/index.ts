import { authHandlers } from './auth'
import { canteenHandlers } from './canteen'
import { dishHandlers } from './dish'
import { cartHandlers } from './cart'
import { addressHandlers } from './address'

export const handlers = [
  ...authHandlers,
  ...canteenHandlers,
  ...dishHandlers,
  ...cartHandlers,
  ...addressHandlers,
]


