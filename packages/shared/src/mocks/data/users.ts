import type { User } from '@campus-food/shared'
import { loadFromStorage, saveToStorage } from './storage'

const STORAGE_KEY = 'mock_users'

/**
 * 测试用户数据
 */
export const users: User[] = loadFromStorage<User[]>(STORAGE_KEY, [
  {
    id: '1',
    studentId: '2021001',
    name: '张三',
    phone: '13800138001',
    avatar: 'https://via.placeholder.com/100',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    studentId: '2021002',
    name: '李四',
    phone: '13800138002',
    avatar: 'https://via.placeholder.com/100',
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    studentId: '2021003',
    name: '王五',
    phone: '13800138003',
    createdAt: '2024-01-03T00:00:00.000Z',
  },
])

/**
 * 保存用户数据到 localStorage
 */
export function saveUsers(): void {
  saveToStorage(STORAGE_KEY, users)
}

/**
 * 用户密码映射 (明文存储仅用于开发)
 */
export const userPasswords: Record<string, string> = {
  '2021001': 'password123',
  '2021002': 'password123',
  '2021003': 'password123',
}
