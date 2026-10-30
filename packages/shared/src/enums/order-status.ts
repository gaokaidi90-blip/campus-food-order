/**
 * 订单状态枚举
 */
export enum OrderStatus {
  /** 待接单 */
  PENDING = 'pending',
  /** 已接单 */
  ACCEPTED = 'accepted',
  /** 已出餐 */
  READY = 'ready',
  /** 已取消 */
  CANCELLED = 'cancelled',
}

/**
 * 订单状态标签映射
 */
export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '待接单',
  [OrderStatus.ACCEPTED]: '已接单',
  [OrderStatus.READY]: '已出餐',
  [OrderStatus.CANCELLED]: '已取消',
}
