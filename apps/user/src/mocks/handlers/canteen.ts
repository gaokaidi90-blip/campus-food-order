import { http, HttpResponse } from 'msw'
import type { Res } from '@campus-food/shared'
import { canteens } from '../data/canteens'
import { categories } from '../data/categories'
import { dishes } from '../data/dishes'
import { validateUserToken } from './auth'

export const canteenHandlers = [
  // 获取食堂列表
  http.get('/api/user/canteens', ({ request }) => {
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

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: canteens.filter((c) => c.status === 1),
    })
  }),

  // 获取食堂详情
  http.get('/api/user/canteens/:id', ({ request, params }) => {
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
    const canteen = canteens.find((c) => c.id === id && c.status === 1)

    if (!canteen) {
      return HttpResponse.json(
        {
          code: 404,
          message: '食堂不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 获取该食堂的分类
    const canteenCategories = categories.filter((cat) => cat.canteenId === id)

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        ...canteen,
        categories: canteenCategories,
      },
    })
  }),
]
