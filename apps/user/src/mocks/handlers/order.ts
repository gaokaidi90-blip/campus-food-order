import { http, HttpResponse } from 'msw'
import type { CreateOrderReq, Order } from '@campus-food/shared'
import { OrderStatus } from '@campus-food/shared'
import { orders, dishes, addresses, canteens, carts } from '../data'
import { validateUserToken } from './auth'

/**
 * 订单管理 Mock Handlers
 * 处理订单相关的 API 请求
 */
export const orderHandlers = [
  // 获取订单列表
  http.get('/api/user/orders', ({ request }) => {
    const token = validateUserToken(request)

    if (!token) {
      return HttpResponse.json(
        {
          code: 401,
          message: '未授权访问',
          data: null,
        },
        { status: 401 }
      )
    }

    const userId = token.split('_')[2]
    const url = new URL(request.url)
    const status = url.searchParams.get('status') as OrderStatus | null

    // 获取该用户的订单列表
    let userOrders = orders.filter((order) => order.userId === userId)

    // 按状态筛选
    if (status) {
      userOrders = userOrders.filter((order) => order.status === status)
    }

    // 按创建时间倒序
    userOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: userOrders,
    })
  }),

  // 获取订单详情
  http.get('/api/user/orders/:id', ({ request, params }) => {
    const token = validateUserToken(request)

    if (!token) {
      return HttpResponse.json(
        {
          code: 401,
          message: '未授权访问',
          data: null,
        },
        { status: 401 }
      )
    }

    const userId = token.split('_')[2]
    const { id } = params

    const order = orders.find((o) => o.id === id && o.userId === userId)

    if (!order) {
      return HttpResponse.json(
        {
          code: 404,
          message: '订单不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: order,
    })
  }),

  // 创建订单
  http.post('/api/user/orders', async ({ request }) => {
    const token = validateUserToken(request)

    if (!token) {
      return HttpResponse.json(
        {
          code: 401,
          message: '未授权访问',
          data: null,
        },
        { status: 401 }
      )
    }

    const userId = token.split('_')[2]
    const body = (await request.json()) as CreateOrderReq

    // 验证地址
    const address = addresses.find(
      (addr) => addr.id === body.addressId && addr.userId === userId
    )
    if (!address) {
      return HttpResponse.json(
        {
          code: 400,
          message: '收货地址不存在',
          data: null,
        },
        { status: 400 }
      )
    }

    // 验证食堂
    const canteen = canteens.find((c) => c.id === body.canteenId)
    if (!canteen) {
      return HttpResponse.json(
        {
          code: 400,
          message: '食堂不存在',
          data: null,
        },
        { status: 400 }
      )
    }

    // 构建订单项并计算总价
    const orderItems: Order['items'] = []
    let totalAmount = 0

    for (const item of body.items) {
      const dish = dishes.find((d) => d.id === item.dishId && d.status === 1)
      if (!dish) {
        return HttpResponse.json(
          {
            code: 400,
            message: `菜品 ${item.dishId} 不存在或已下架`,
            data: null,
          },
          { status: 400 }
        )
      }

      const orderItem = {
        id: `item_${Date.now()}_${Math.random()}`,
        orderId: '', // 稍后填充
        dishId: dish.id,
        dishName: dish.name,
        dishImage: dish.image,
        price: dish.price,
        quantity: item.quantity,
      }

      orderItems.push(orderItem)
      totalAmount += dish.price * item.quantity
    }

    // 创建订单
    const orderNo = `ORD${Date.now()}`
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      orderNo,
      userId,
      canteenId: body.canteenId,
      addressId: body.addressId,
      status: OrderStatus.PENDING,
      totalAmount,
      remark: body.remark,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItems,
      address: {
        name: address.name,
        phone: address.phone,
        address: `${address.address} ${address.building} ${address.room}`,
      },
      canteen: {
        name: canteen.name,
      },
    }

    // 更新订单项的 orderId
    orderItems.forEach((item) => {
      item.orderId = newOrder.id
    })

    orders.push(newOrder)

    // 清空购物车中对应食堂的菜品
    const cartIndices = carts
      .map((c, index) => (c.userId === userId && c.canteenId === body.canteenId ? index : -1))
      .filter((i) => i !== -1)
      .reverse()

    cartIndices.forEach((index) => {
      carts.splice(index, 1)
    })

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: newOrder,
    })
  }),

  // 取消订单
  http.post('/api/user/orders/:id/cancel', async ({ request, params }) => {
    const token = validateUserToken(request)

    if (!token) {
      return HttpResponse.json(
        {
          code: 401,
          message: '未授权访问',
          data: null,
        },
        { status: 401 }
      )
    }

    const userId = token.split('_')[2]
    const { id } = params
    const body = (await request.json()) as { reason: string }

    const order = orders.find((o) => o.id === id && o.userId === userId)

    if (!order) {
      return HttpResponse.json(
        {
          code: 404,
          message: '订单不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 只有待接单和已接单状态可以取消
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.ACCEPTED) {
      return HttpResponse.json(
        {
          code: 400,
          message: '该订单状态不允许取消',
          data: null,
        },
        { status: 400 }
      )
    }

    // 更新订单状态为已取消
    order.status = OrderStatus.CANCELLED
    order.cancelReason = body.reason
    order.updatedAt = new Date().toISOString()

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: order,
    })
  }),
]
