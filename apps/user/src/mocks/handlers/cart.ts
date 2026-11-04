import { http, HttpResponse } from 'msw'
import type { AddCartReq, UpdateCartReq } from '@campus-food/shared'
import { carts, dishes } from '../data'
import { validateUserToken } from './auth'

/**
 * 购物车 Mock Handlers
 * 处理购物车相关的 API 请求
 */
export const cartHandlers = [
  // 获取购物车列表
  http.get('/api/user/cart', ({ request }) => {
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

    // 从 token 中提取用户 ID
    const userId = token.split('_')[2]

    // 获取该用户的购物车项
    const userCarts = carts.filter((c) => c.userId === userId)

    // 填充菜品信息
    const cartsWithDish = userCarts.map((cart) => {
      const dish = dishes.find((d) => d.id === cart.dishId)
      return {
        ...cart,
        dish: dish
          ? {
              id: dish.id,
              name: dish.name,
              image: dish.image,
              price: dish.price,
            }
          : undefined,
      }
    })

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: cartsWithDish,
    })
  }),

  // 添加到购物车
  http.post('/api/user/cart', async ({ request }) => {
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
    const body = (await request.json()) as AddCartReq

    // 检查菜品是否存在
    const dish = dishes.find((d) => d.id === body.dishId && d.status === 1)
    if (!dish) {
      return HttpResponse.json(
        {
          code: 404,
          message: '菜品不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 检查是否已存在该菜品
    const existingCart = carts.find(
      (c) => c.userId === userId && c.dishId === body.dishId
    )

    if (existingCart) {
      // 更新数量
      existingCart.quantity += body.quantity
      existingCart.updatedAt = new Date().toISOString()
    } else {
      // 新增购物车项
      const newCart = {
        id: `cart_${Date.now()}`,
        userId,
        dishId: body.dishId,
        canteenId: dish.canteenId,
        quantity: body.quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      carts.push(newCart)
    }

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: null,
    })
  }),

  // 更新购物车项
  http.put('/api/user/cart/:id', async ({ request, params }) => {
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
    const body = (await request.json()) as UpdateCartReq

    const cartIndex = carts.findIndex(
      (c) => c.id === id && c.userId === userId
    )

    if (cartIndex === -1) {
      return HttpResponse.json(
        {
          code: 404,
          message: '购物车项不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 更新数量
    carts[cartIndex]!.quantity = body.quantity
    carts[cartIndex]!.updatedAt = new Date().toISOString()

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: null,
    })
  }),

  // 删除购物车项
  http.delete('/api/user/cart/:id', ({ request, params }) => {
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

    const cartIndex = carts.findIndex(
      (c) => c.id === id && c.userId === userId
    )

    if (cartIndex === -1) {
      return HttpResponse.json(
        {
          code: 404,
          message: '购物车项不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 删除购物车项
    carts.splice(cartIndex, 1)

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: null,
    })
  }),

  // 清空购物车
  http.delete('/api/user/cart', ({ request }) => {
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

    // 删除该用户的所有购物车项
    const userCartIndices = carts
      .map((c, index) => (c.userId === userId ? index : -1))
      .filter((i) => i !== -1)
      .reverse() // 从后往前删除避免索引问题

    userCartIndices.forEach((index) => {
      carts.splice(index, 1)
    })

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: null,
    })
  }),
]
