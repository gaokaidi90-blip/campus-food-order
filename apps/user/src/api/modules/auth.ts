import type { User, UserLoginReq, UserLoginRes, Admin } from '@campus-food/shared'
import { post, get } from '@/utils/request'

/**
 * 用户登录
 */
export function login(data: UserLoginReq) {
  return post<UserLoginRes>('/user/login', data)
}

/**
 * 管理员登录
 */
export function adminLogin(data: { username: string; password: string }) {
  return post<{ token: string; admin: Omit<Admin, 'password'> }>('/admin/login', data)
}

/**
 * 获取用户信息
 */
export function getProfile() {
  return get<User>('/user/profile')
}
