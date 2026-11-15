import { http, HttpResponse } from 'msw'
import type { Res, PageRes } from '@campus-food/shared'
import {
  canteens,
  categories,
  dishes,
  users,
  orders,
  carts,
  addresses,
  saveOrders,
  saveCarts,
  saveAddresses,
} from '@campus-food/shared/mocks/data'

export const handlers = [
  // 获取食堂列表
  http.get('/api/canteens', () => {
    return HttpResponse.json<PageRes<any>>({
      code: 200,
      message: 'success',
      data: {
        items: canteens,
        total: canteens.length,
      },
    })
  }),

  // 获取分类列表
  http.get('/api/categories', ({ request }) => {
    const url = new URL(request.url)
    const canteenId = url.searchParams.get('canteenId')

    let filtered = categories
    if (canteenId) {
      filtered = categories.filter((c) => c.canteenId === canteenId)
    }

    return HttpResponse.json<Res<any[]>>({
      code: 200,
      message: 'success',
      data: filtered,
    })
  }),

  // 获取菜品列表
  http.get('/api/dishes', ({ request }) => {
    const url = new URL(request.url)
    const canteenId = url.searchParams.get('canteenId')
    const categoryId = url.searchParams.get('categoryId')

    let filtered = dishes.filter((d) => d.status === 'available')

    if (canteenId) {
      filtered = filtered.filter((d) => d.canteenId === canteenId)
    }
    if (categoryId) {
      filtered = filtered.filter((d) => d.categoryId === categoryId)
    }

    return HttpResponse.json<PageRes<any>>({
      code: 200,
      message: 'success',
      data: {
        items: filtered,
        total: filtered.length,
      },
    })
  }),

  // 获取菜品详情
  http.get('/api/dishes/:id', ({ params }) => {
    const dish = dishes.find((d) => d.id === params.id)
    if (!dish) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '菜品不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: 'success',
      data: dish,
    })
  }),

  // 获取购物车
  http.get('/api/cart', ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const userCarts = carts.filter((c) => c.userId === token)

    return HttpResponse.json<Res<any[]>>({
      code: 200,
      message: 'success',
      data: userCarts,
    })
  }),

  // 添加到购物车
  http.post('/api/cart', async ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as any

    const existingCart = carts.find(
      (c) => c.userId === token && c.dishId === body.dishId
    )

    if (existingCart) {
      existingCart.quantity += body.quantity || 1
    } else {
      const dish = dishes.find((d) => d.id === body.dishId)
      if (!dish) {
        return HttpResponse.json<Res<null>>(
          { code: 404, message: '菜品不存在', data: null },
          { status: 404 }
        )
      }

      carts.push({
        id: String(Date.now()),
        userId: token,
        dishId: body.dishId,
        dishName: dish.name,
        dishImage: dish.image,
        price: dish.price,
        quantity: body.quantity || 1,
        canteenId: dish.canteenId,
      })
    }

    saveCarts()

    return HttpResponse.json<Res<null>>({
      code: 200,
      message: '已添加到购物车',
      data: null,
    })
  }),

  // 更新购物车
  http.put('/api/cart/:id', async ({ request, params }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as any
    const cartIndex = carts.findIndex(
      (c) => c.id === params.id && c.userId === token
    )

    if (cartIndex === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '购物车项不存在', data: null },
        { status: 404 }
      )
    }

    carts[cartIndex].quantity = body.quantity

    saveCarts()

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: '更新成功',
      data: carts[cartIndex],
    })
  }),

  // 删除购物车项
  http.delete('/api/cart/:id', ({ request, params }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const cartIndex = carts.findIndex(
      (c) => c.id === params.id && c.userId === token
    )

    if (cartIndex === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '购物车项不存在', data: null },
        { status: 404 }
      )
    }

    carts.splice(cartIndex, 1)
    saveCarts()

    return HttpResponse.json<Res<null>>({
      code: 200,
      message: '删除成功',
      data: null,
    })
  }),

  // 获取订单列表
  http.get('/api/orders', ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const userOrders = orders
      .filter((o) => o.userId === token)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return HttpResponse.json<PageRes<any>>({
      code: 200,
      message: 'success',
      data: {
        items: userOrders,
        total: userOrders.length,
      },
    })
  }),

  // 创建订单
  http.post('/api/orders', async ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as any

    const newOrder = {
      id: String(Date.now()),
      orderNo: `ORD${Date.now()}`,
      userId: token,
      items: body.items,
      totalAmount: body.totalAmount,
      status: 'pending',
      address: body.address,
      remark: body.remark || '',
      canteen: body.canteen,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    orders.push(newOrder)
    saveOrders()

    // 清空购物车
    const userCartIndices = []
    for (let i = carts.length - 1; i >= 0; i--) {
      if (carts[i].userId === token) {
        userCartIndices.push(i)
      }
    }
    for (const index of userCartIndices) {
      carts.splice(index, 1)
    }
    saveCarts()

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: '下单成功',
      data: newOrder,
    })
  }),

  // 获取收货地址列表
  http.get('/api/addresses', ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const userAddresses = addresses.filter((a) => a.userId === token)

    return HttpResponse.json<Res<any[]>>({
      code: 200,
      message: 'success',
      data: userAddresses,
    })
  }),

  // 创建收货地址
  http.post('/api/addresses', async ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as any

    // 如果设为默认地址，取消其他默认地址
    if (body.isDefault) {
      addresses.forEach((a) => {
        if (a.userId === token) {
          a.isDefault = false
        }
      })
    }

    const newAddress = {
      id: String(Date.now()),
      userId: token,
      name: body.name,
      phone: body.phone,
      address: body.address,
      isDefault: body.isDefault || false,
    }

    addresses.push(newAddress)
    saveAddresses()

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: '添加成功',
      data: newAddress,
    })
  }),

  // 更新收货地址
  http.put('/api/addresses/:id', async ({ request, params }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as any
    const addressIndex = addresses.findIndex(
      (a) => a.id === params.id && a.userId === token
    )

    if (addressIndex === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '地址不存在', data: null },
        { status: 404 }
      )
    }

    // 如果设为默认地址，取消其他默认地址
    if (body.isDefault) {
      addresses.forEach((a) => {
        if (a.userId === token && a.id !== params.id) {
          a.isDefault = false
        }
      })
    }

    addresses[addressIndex] = {
      ...addresses[addressIndex],
      ...body,
    }

    saveAddresses()

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: '更新成功',
      data: addresses[addressIndex],
    })
  }),

  // 删除收货地址
  http.delete('/api/addresses/:id', ({ request, params }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const addressIndex = addresses.findIndex(
      (a) => a.id === params.id && a.userId === token
    )

    if (addressIndex === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '地址不存在', data: null },
        { status: 404 }
      )
    }

    addresses.splice(addressIndex, 1)
    saveAddresses()

    return HttpResponse.json<Res<null>>({
      code: 200,
      message: '删除成功',
      data: null,
    })
  }),

  // 用户登录
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as any

    const user = users.find((u) => u.phone === body.phone)

    if (!user) {
      return HttpResponse.json<Res<null>>(
        { code: 400, message: '用户不存在', data: null },
        { status: 400 }
      )
    }

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: '登录成功',
      data: {
        token: user.id,
        user,
      },
    })
  }),

  // 用户注册
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as any

    const existingUser = users.find((u) => u.phone === body.phone)

    if (existingUser) {
      return HttpResponse.json<Res<null>>(
        { code: 400, message: '手机号已注册', data: null },
        { status: 400 }
      )
    }

    const newUser = {
      id: String(Date.now()),
      name: body.name,
      phone: body.phone,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      role: 'user',
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: '注册成功',
      data: {
        token: newUser.id,
        user: newUser,
      },
    })
  }),

  // 获取用户信息
  http.get('/api/profile', ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      )
    }

    const user = users.find((u) => u.id === token)

    if (!user) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '用户不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json<Res<any>>({
      code: 200,
      message: 'success',
      data: user,
    })
  }),
]
