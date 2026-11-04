import type { User } from '@campus-food/shared'
import { get, put } from '@/utils/request'

/**
 * 获取用户个人信息
 */
export function getUserProfile() {
  return get<Omit<User, 'password'>>('/user/profile')
}

/**
 * 更新用户个人信息
 */
export function updateUserProfile(data: { name?: string; avatar?: string }) {
  return put<Omit<User, 'password'>>('/user/profile', data)
}
