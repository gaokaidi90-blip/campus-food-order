import type { User, PageRes } from '@campus-food/shared'
import { get, put } from '@/utils/request'

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

/**
 * 更新用户信息
 */
export function updateUser(id: string, data: { name: string; phone: string; avatar: string }) {
  return put<User>(`/admin/users/${id}`, data)
}
