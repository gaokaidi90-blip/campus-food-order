import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, OrderStatus } from '@campus-food/shared'
import { getOrders, getOrderDetail } from '@/api'

/**
 * 订单状态管理 Store
 * 管理订单数据和相关操作
 */
export const useOrderStore = defineStore('order', () => {
  // 订单列表
  const orders = ref<Order[]>([])
  // 当前订单详情
  const currentOrder = ref<Order | null>(null)

  /**
   * 获取订单列表
   * @param status 订单状态筛选（可选）
   */
  async function fetchOrders(status?: OrderStatus) {
    const { data } = await getOrders(status)
    orders.value = data.data
    return data.data
  }

  /**
   * 获取订单详情
   * @param id 订单 ID
   */
  async function fetchOrderDetail(id: string) {
    const { data } = await getOrderDetail(id)
    currentOrder.value = data.data
    return data.data
  }

  return {
    orders,
    currentOrder,
    fetchOrders,
    fetchOrderDetail,
  }
})
