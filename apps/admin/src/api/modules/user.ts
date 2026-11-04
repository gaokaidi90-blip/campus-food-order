import type { User, PageRes } from '@campus-food/shared'
import { get } from '@/utils/request'

/**
 * 获取用户列表
 */
export function getUserList(params?: { keyword?: string; page?: number; pageSize?: number }) {
  return get<PageRes<User>>('/admin/users', { params })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: string) {
  return get<User>(`/admin/users/${id}`)
}
