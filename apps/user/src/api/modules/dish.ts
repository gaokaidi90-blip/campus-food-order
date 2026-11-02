import type { Dish } from '@campus-food/shared'
import { get } from '@/utils/request'

/**
 * 获取菜品列表
 */
export function getDishes(params?: { categoryId?: string; canteenId?: string }) {
  return get<Dish[]>('/user/dishes', { params })
}

/**
 * 获取菜品详情
 */
export function getDishDetail(id: string) {
  return get<Dish>(`/user/dishes/${id}`)
}
