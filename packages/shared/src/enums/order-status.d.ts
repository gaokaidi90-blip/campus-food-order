/**
 * 订单状态枚举
 */
export declare enum OrderStatus {
    /** 待接单 */
    PENDING = "pending",
    /** 已接单 */
    ACCEPTED = "accepted",
    /** 已出餐 */
    READY = "ready",
    /** 已取消 */
    CANCELLED = "cancelled"
}
/**
 * 订单状态标签映射
 */
export declare const OrderStatusLabel: Record<OrderStatus, string>;
