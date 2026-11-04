import { http, HttpResponse } from 'msw'
import type { Res } from '@campus-food/shared'
import { OrderStatus } from '@campus-food/shared'
import { orders } from '../data'
import { validateAdminToken } from './auth'
import type { DashboardStats } from '@/api/modules/stats'

/**
 * 统计数据 Mock Handlers
 */
export const statsHandlers = [
  /**
   * 获取仪表板统计数据
   */
  http.get('/api/admin/stats/dashboard', ({ request }) => {
    const token = validateAdminToken(request)

    if (!token) {
      return HttpResponse.json<Res<null>>(
        {
          code: 401,
          message: '未授权访问',
          data: null,
        },
        { status: 401 }
      )
    }

    // 计算总订单数
    const totalOrders = orders.length

    // 计算今日订单数
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    }).length

    // 计算总营业额（不包括已取消的订单）
    const totalRevenue = orders
      .filter((order) => order.status !== OrderStatus.CANCELLED)
      .reduce((sum, order) => sum + order.totalAmount, 0)

    // 计算今日营业额（不包括已取消的订单）
    const todayRevenue = orders
      .filter((order) => {
        if (order.status === OrderStatus.CANCELLED) return false
        const orderDate = new Date(order.createdAt)
        orderDate.setHours(0, 0, 0, 0)
        return orderDate.getTime() === today.getTime()
      })
      .reduce((sum, order) => sum + order.totalAmount, 0)

    const stats: DashboardStats = {
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
    }

    return HttpResponse.json<Res<DashboardStats>>({
      code: 200,
      message: 'success',
      data: stats,
    })
  }),
]
