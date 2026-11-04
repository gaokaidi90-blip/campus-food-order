import type { Order } from '@campus-food/shared'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './storage'

/**
 * 订单数据 (从 localStorage 加载)
 */
export const orders: Order[] = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, [])

/**
 * 保存订单到 localStorage
 */
export function saveOrders(): void {
  saveToStorage(STORAGE_KEYS.ORDERS, orders)
}

