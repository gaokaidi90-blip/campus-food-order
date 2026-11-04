import { http, HttpResponse } from 'msw'
import type { Res } from '@campus-food/shared'
import { dishes } from '../data'
import { validateUserToken } from './auth'

export const dishHandlers = [
  // 获取菜品列表
  http.get('/api/user/dishes', ({ request }) => {
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

    const url = new URL(request.url)
    const categoryId = url.searchParams.get('categoryId')
    const canteenId = url.searchParams.get('canteenId')

    let filteredDishes = dishes.filter((d) => d.status === 1)

    if (categoryId) {
      filteredDishes = filteredDishes.filter((d) => d.categoryId === categoryId)
    }

    if (canteenId) {
      filteredDishes = filteredDishes.filter((d) => d.canteenId === canteenId)
    }

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: filteredDishes,
    })
  }),

  // 获取菜品详情
  http.get('/api/user/dishes/:id', ({ request, params }) => {
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

    const { id } = params
    const dish = dishes.find((d) => d.id === id && d.status === 1)

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

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: dish,
    })
  }),
]
