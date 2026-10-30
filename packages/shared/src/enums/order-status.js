/**
 * 订单状态枚举
 */
export var OrderStatus;
(function (OrderStatus) {
    /** 待接单 */
    OrderStatus["PENDING"] = "pending";
    /** 已接单 */
    OrderStatus["ACCEPTED"] = "accepted";
    /** 已出餐 */
    OrderStatus["READY"] = "ready";
    /** 已取消 */
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (OrderStatus = {}));
/**
 * 订单状态标签映射
 */
export const OrderStatusLabel = {
    [OrderStatus.PENDING]: '待接单',
    [OrderStatus.ACCEPTED]: '已接单',
    [OrderStatus.READY]: '已出餐',
    [OrderStatus.CANCELLED]: '已取消',
};
