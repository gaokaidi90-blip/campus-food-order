/**
 * localStorage 数据持久化工具
 * 用于在用户端和管理端之间共享 Mock 数据
 */

const STORAGE_KEYS = {
  ORDERS: 'mock_orders',
  CANTEENS: 'mock_canteens',
  CATEGORIES: 'mock_categories',
  DISHES: 'mock_dishes',
  USERS: 'mock_users',
  ADDRESSES: 'mock_addresses',
  CARTS: 'mock_carts',
}

/**
 * 从 localStorage 加载数据
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error(`[Storage] Failed to load ${key}:`, error)
  }
  return defaultValue
}

/**
 * 保存数据到 localStorage
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`[Storage] Failed to save ${key}:`, error)
  }
}

/**
 * 清空所有 Mock 数据
 */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}

export { STORAGE_KEYS }
