import { get } from '@/utils/request'

/**
 * 仪表板统计数据
 */
export interface DashboardStats {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
}

/**
 * 趋势数据
 */
export interface TrendData {
  date: string    // 日期 YYYY-MM-DD
  value: number   // 数值
}

/**
 * 订单状态分布
 */
export interface StatusDistribution {
  status: string  // 状态：pending/accepted/ready/cancelled
  count: number   // 数量
}

/**
 * 菜品排行
 */
export interface DishRank {
  dishId: string
  dishName: string
  count: number       // 销售数量
  revenue: number     // 销售额
}

/**
 * 食堂对比统计
 */
export interface CanteenStats {
  canteenId: string
  canteenName: string
  orders: number
  revenue: number
}

/**
 * 获取仪表板统计数据
 */
export function getDashboardStats() {
  return get<DashboardStats>('/admin/stats/dashboard')
}

/**
 * 获取订单趋势
 */
export function getOrderTrend(days: number = 7) {
  return get<TrendData[]>('/admin/stats/trend/orders', { params: { days } })
}

/**
 * 获取营业额趋势
 */
export function getRevenueTrend(days: number = 7) {
  return get<TrendData[]>('/admin/stats/trend/revenue', { params: { days } })
}

/**
 * 获取订单状态分布
 */
export function getOrderStatusDistribution() {
  return get<StatusDistribution[]>('/admin/stats/distribution/status')
}

/**
 * 获取热销菜品排行
 */
export function getTopDishes(limit: number = 10) {
  return get<DishRank[]>('/admin/stats/ranking/dishes', { params: { limit } })
}

/**
 * 获取食堂对比数据（仅超级管理员）
 */
export function getCanteenComparison() {
  return get<CanteenStats[]>('/admin/stats/canteen-comparison')
}
