import type { User } from '@campus-food/shared'
import { get } from '@/utils/request'

/**
 * 获取用户个人信息
 */
export function getUserProfile() {
  return get<Omit<User, 'password'>>('/user/profile')
}
