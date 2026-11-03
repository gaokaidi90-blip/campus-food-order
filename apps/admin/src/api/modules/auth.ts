import type { Admin } from '@campus-food/shared'
import { post } from '@/utils/request'

/**
 * 管理员登录
 */
export function login(data: { username: string; password: string }) {
  return post<{ token: string; admin: Omit<Admin, 'password'> }>('/admin/login', data)
}
