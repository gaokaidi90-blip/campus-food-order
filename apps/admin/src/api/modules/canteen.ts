import type { Canteen, PageRes } from '@campus-food/shared'
import { get, post, put, del } from '@/utils/request'

/**
 * 获取食堂列表
 */
export function getCanteenList(params?: { keyword?: string; page?: number; pageSize?: number }) {
  return get<PageRes<Canteen>>('/admin/canteens', { params })
}

/**
 * 获取食堂详情
 */
export function getCanteenDetail(id: string) {
  return get<Canteen>(`/admin/canteens/${id}`)
}

/**
 * 创建食堂
 */
export function createCanteen(data: Omit<Canteen, 'id' | 'createdAt' | 'updatedAt'>) {
  return post<Canteen>('/admin/canteens', data)
}

/**
 * 更新食堂
 */
export function updateCanteen(id: string, data: Partial<Canteen>) {
  return put<Canteen>(`/admin/canteens/${id}`, data)
}

/**
 * 删除食堂
 */
export function deleteCanteen(id: string) {
  return del<null>(`/admin/canteens/${id}`)
}
