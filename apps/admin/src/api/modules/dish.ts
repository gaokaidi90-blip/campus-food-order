import type { Dish, PageRes } from '@campus-food/shared'
import { get, post, put, del } from '@/utils/request'

/**
 * 获取菜品列表
 */
export function getDishList(params?: {
  canteenId?: string
  categoryId?: string
  keyword?: string
  page?: number
  pageSize?: number
}) {
  return get<PageRes<Dish>>('/admin/dishes', { params })
}

/**
 * 获取菜品详情
 */
export function getDishDetail(id: string) {
  return get<Dish>(`/admin/dishes/${id}`)
}

/**
 * 创建菜品
 */
export function createDish(data: Omit<Dish, 'id' | 'sales' | 'createdAt' | 'updatedAt'>) {
  return post<Dish>('/admin/dishes', data)
}

/**
 * 更新菜品
 */
export function updateDish(id: string, data: Partial<Dish>) {
  return put<Dish>(`/admin/dishes/${id}`, data)
}

/**
 * 删除菜品
 */
export function deleteDish(id: string) {
  return del<null>(`/admin/dishes/${id}`)
}
