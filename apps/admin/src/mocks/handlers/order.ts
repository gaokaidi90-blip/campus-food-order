import { http, HttpResponse } from 'msw'
import type { Res, Order } from '@campus-food/shared'
import { OrderStatus } from '@campus-food/shared'
import { orders } from '../data'
import { validateAdminToken } from './auth'

export const orderHandlers = [
  /**
   * 获取订单列表
   * 支持按食堂 ID、订单状态过滤
   */
  http.get('/api/admin/orders', ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const canteenId = url.searchParams.get('canteenId') || ''
    const status = url.searchParams.get('status') || ''

    // 根据条件过滤
    let filtered = orders
    if (canteenId) {
      filtered = filtered.filter((o) => o.canteenId === canteenId)
    }
    if (status) {
      filtered = filtered.filter((o) => o.status === status)
    }

    // 按创建时间倒序排列
    filtered = [...filtered].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return HttpResponse.json<Res<Order[]>>({
      code: 200,
      message: 'success',
      data: filtered,
    })
  }),

  /**
   * 获取订单详情
   */
  http.get('/api/admin/orders/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const order = orders.find((o) => o.id === id)

    if (!order) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '订单不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json<Res<Order>>({
      code: 200,
      message: 'success',
      data: order,
    })
  }),

  /**
   * 更新订单状态
   * 支持接单、出餐、取消操作
   */
  http.put('/api/admin/orders/:id/status', async ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const body = (await request.json()) as { status: OrderStatus }

    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '订单不存在', data: null },
        { status: 404 }
      )
    }

    const order = orders[index]

    // 状态流转验证
    if (body.status === OrderStatus.ACCEPTED && order.status !== OrderStatus.PENDING) {
      return HttpResponse.json<Res<null>>(
        { code: 400, message: '只能接单待接单状态的订单', data: null },
        { status: 400 }
      )
    }

    if (body.status === OrderStatus.READY && order.status !== OrderStatus.ACCEPTED) {
      return HttpResponse.json<Res<null>>(
        { code: 400, message: '只能对已接单的订单进行出餐操作', data: null },
        { status: 400 }
      )
    }

    if (body.status === OrderStatus.CANCELLED &&
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.ACCEPTED) {
      return HttpResponse.json<Res<null>>(
        { code: 400, message: '只能取消待接单或已接单的订单', data: null },
        { status: 400 }
      )
    }

    // 更新订单状态
    orders[index] = {
      ...order,
      status: body.status,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json<Res<Order>>({
      code: 200,
      message: '操作成功',
      data: orders[index],
    })
  }),
]
