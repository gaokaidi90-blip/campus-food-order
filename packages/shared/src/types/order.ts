import type { OrderStatus } from '../enums/order-status'

/**
 * 订单实体
 */
export interface Order {
  id: string
  orderNo: string
  userId: string
  canteenId: string
  addressId: string
  status: OrderStatus
  totalAmount: number
  remark?: string
  cancelReason?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  address?: {
    name: string
    phone: string
    address: string
  }
  canteen?: {
    name: string
  }
}

/**
 * 订单项
 */
export interface OrderItem {
  id: string
  orderId: string
  dishId: string
  dishName: string
  dishImage: string
  price: number
  quantity: number
}

/**
 * 创建订单请求
 */
export interface CreateOrderReq {
  canteenId: string
  addressId: string
  items: {
    dishId: string
    quantity: number
  }[]
  remark?: string
}
