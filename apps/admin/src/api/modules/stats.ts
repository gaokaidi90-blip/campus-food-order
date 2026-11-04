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
 * 获取仪表板统计数据
 */
export function getDashboardStats() {
  return get<DashboardStats>('/admin/stats/dashboard')
}
