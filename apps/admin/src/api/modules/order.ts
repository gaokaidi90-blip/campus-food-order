import type { Order, OrderStatus, PageRes } from '@campus-food/shared'
import { get, put } from '@/utils/request'

/**
 * 获取订单列表
 */
export function getOrderList(params?: {
  canteenId?: string
  status?: string
  page?: number
  pageSize?: number
}) {
  return get<PageRes<Order>>('/admin/orders', { params })
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id: string) {
  return get<Order>(`/admin/orders/${id}`)
}

/**
 * 更新订单状态
 */
export function updateOrderStatus(id: string, status: OrderStatus) {
  return put<Order>(`/admin/orders/${id}/status`, { status })
}
