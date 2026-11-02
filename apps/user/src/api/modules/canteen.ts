import type { Canteen, Category, Dish } from '@campus-food/shared'
import { get } from '@/utils/request'

/**
 * 获取食堂列表
 */
export function getCanteens() {
  return get<Canteen[]>('/user/canteens')
}

/**
 * 获取食堂详情
 */
export function getCanteenDetail(id: string) {
  return get<Canteen & { categories: Category[] }>(`/user/canteens/${id}`)
}
