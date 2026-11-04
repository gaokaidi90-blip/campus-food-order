import type { Order, CreateOrderReq, OrderStatus } from '@campus-food/shared'
import { get, post } from '@/utils/request'

/**
 * 获取订单列表
 * @param status 订单状态筛选（可选）
 */
export function getOrders(status?: OrderStatus) {
  return get<Order[]>('/user/orders', {
    params: status ? { status } : undefined,
  })
}

/**
 * 获取订单详情
 * @param id 订单 ID
 */
export function getOrderDetail(id: string) {
  return get<Order>(`/user/orders/${id}`)
}

/**
 * 创建订单
 * @param data 订单信息
 */
export function createOrder(data: CreateOrderReq) {
  return post<Order>('/user/orders', data)
}

/**
 * 取消订单
 * @param id 订单 ID
 * @param reason 取消原因
 */
export function cancelOrder(id: string, reason: string) {
  return post<Order>(`/user/orders/${id}/cancel`, { reason })
}
