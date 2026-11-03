import { http, HttpResponse } from 'msw'
import type { CreateAddressReq, UpdateAddressReq } from '@campus-food/shared'
import { addresses } from '../data/addresses'
import { validateUserToken } from './auth'

/**
 * 地址管理 Mock Handlers
 * 处理收货地址相关的 API 请求
 */
export const addressHandlers = [
  // 获取地址列表
  http.get('/api/user/addresses', ({ request }) => {
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

    // 获取该用户的地址列表
    const userAddresses = addresses.filter((addr) => addr.userId === userId)

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: userAddresses,
    })
  }),

  // 创建地址
  http.post('/api/user/addresses', async ({ request }) => {
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
    const body = (await request.json()) as CreateAddressReq

    // 如果设置为默认地址，取消其他默认地址
    if (body.isDefault === 1) {
      addresses.forEach((addr) => {
        if (addr.userId === userId) {
          addr.isDefault = 0
        }
      })
    }

    // 创建新地址
    const newAddress = {
      id: `addr_${Date.now()}`,
      userId,
      name: body.name,
      phone: body.phone,
      address: body.address,
      building: body.building,
      room: body.room,
      isDefault: body.isDefault || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addresses.push(newAddress)

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: newAddress,
    })
  }),

  // 更新地址
  http.put('/api/user/addresses/:id', async ({ request, params }) => {
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
    const body = (await request.json()) as UpdateAddressReq

    const addressIndex = addresses.findIndex(
      (addr) => addr.id === id && addr.userId === userId
    )

    if (addressIndex === -1) {
      return HttpResponse.json(
        {
          code: 404,
          message: '地址不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 如果设置为默认地址，取消其他默认地址
    if (body.isDefault === 1) {
      addresses.forEach((addr) => {
        if (addr.userId === userId && addr.id !== id) {
          addr.isDefault = 0
        }
      })
    }

    // 更新地址信息
    const address = addresses[addressIndex]!
    Object.assign(address, {
      ...body,
      updatedAt: new Date().toISOString(),
    })

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: address,
    })
  }),

  // 删除地址
  http.delete('/api/user/addresses/:id', ({ request, params }) => {
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

    const addressIndex = addresses.findIndex(
      (addr) => addr.id === id && addr.userId === userId
    )

    if (addressIndex === -1) {
      return HttpResponse.json(
        {
          code: 404,
          message: '地址不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 删除地址
    addresses.splice(addressIndex, 1)

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: null,
    })
  }),
]
