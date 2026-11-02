import type { CartItem, AddCartReq, UpdateCartReq } from '@campus-food/shared'
import { get, post, put, del } from '@/utils/request'

/**
 * 获取购物车列表
 */
export function getCart() {
  return get<CartItem[]>('/user/cart')
}

/**
 * 添加到购物车
 * @param data 包含 dishId 和 quantity
 */
export function addCart(data: AddCartReq) {
  return post<null>('/user/cart', data)
}

/**
 * 更新购物车项
 * @param id 购物车项 ID
 * @param data 包含 quantity
 */
export function updateCart(id: string, data: UpdateCartReq) {
  return put<null>(`/user/cart/${id}`, data)
}

/**
 * 删除购物车项
 * @param id 购物车项 ID
 */
export function deleteCart(id: string) {
  return del<null>(`/user/cart/${id}`)
}

/**
 * 清空购物车
 */
export function clearCart() {
  return del<null>('/user/cart')
}
