import { authHandlers } from './auth'
import { canteenHandlers } from './canteen'
import { dishHandlers } from './dish'

export const handlers = [...authHandlers, ...canteenHandlers, ...dishHandlers]


