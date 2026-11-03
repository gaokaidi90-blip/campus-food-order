/**
 * 本地存储工具函数
 * 封装 localStorage 操作，支持 JSON 序列化
 */

/**
 * 存储数据到 localStorage
 * @param key 存储的键名
 * @param value 存储的值，会自动转为 JSON 字符串
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    const jsonValue = JSON.stringify(value)
    localStorage.setItem(key, jsonValue)
  } catch (error) {
    console.error('存储数据失败:', error)
  }
}

/**
 * 从 localStorage 获取数据
 * @param key 存储的键名
 * @returns 解析后的数据，如果不存在或解析失败则返回 null
 */
export function getStorage<T>(key: string): T | null {
  try {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue === null) {
      return null
    }
    return JSON.parse(jsonValue) as T
  } catch (error) {
    console.error('获取数据失败:', error)
    return null
  }
}

/**
 * 从 localStorage 移除数据
 * @param key 存储的键名
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('移除数据失败:', error)
  }
}

/**
 * 清空 localStorage 所有数据
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空数据失败:', error)
  }
}
