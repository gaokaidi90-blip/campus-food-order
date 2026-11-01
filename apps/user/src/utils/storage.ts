/**
 * 本地存储工具
 */

/**
 * 设置存储
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Storage set error:', error)
  }
}

/**
 * 获取存储
 */
export function getStorage<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Storage get error:', error)
    return null
  }
}

/**
 * 移除存储
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Storage remove error:', error)
  }
}

/**
 * 清空存储
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Storage clear error:', error)
  }
}
