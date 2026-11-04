import { http, HttpResponse } from 'msw'
import type { Res, Dish } from '@campus-food/shared'
import { dishes } from '../data'
import { validateAdminToken } from './auth'

export const dishHandlers = [
  /**
   * 获取菜品列表
   * 支持按食堂 ID、分类 ID 过滤和关键词搜索
   */
  http.get('/api/admin/dishes', ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const canteenId = url.searchParams.get('canteenId') || ''
    const categoryId = url.searchParams.get('categoryId') || ''
    const keyword = url.searchParams.get('keyword') || ''

    // 根据条件过滤
    let filtered = dishes
    if (canteenId) {
      filtered = filtered.filter((d) => d.canteenId === canteenId)
    }
    if (categoryId) {
      filtered = filtered.filter((d) => d.categoryId === categoryId)
    }
    if (keyword) {
      filtered = filtered.filter(
        (d) => d.name.includes(keyword) || d.description.includes(keyword)
      )
    }

    return HttpResponse.json<Res<Dish[]>>({
      code: 200,
      message: 'success',
      data: filtered,
    })
  }),

  /**
   * 获取菜品详情
   */
  http.get('/api/admin/dishes/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const dish = dishes.find((d) => d.id === id)

    if (!dish) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '菜品不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json<Res<Dish>>({
      code: 200,
      message: 'success',
      data: dish,
    })
  }),

  /**
   * 创建菜品
   */
  http.post('/api/admin/dishes', async ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as Omit<Dish, 'id' | 'sales' | 'createdAt' | 'updatedAt'>

    // 创建新菜品
    const newDish: Dish = {
      ...body,
      id: `${dishes.length + 1}`,
      sales: 0,
      status: body.status ?? 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dishes.push(newDish)

    return HttpResponse.json<Res<Dish>>({
      code: 200,
      message: '创建成功',
      data: newDish,
    })
  }),

  /**
   * 更新菜品
   */
  http.put('/api/admin/dishes/:id', async ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const body = (await request.json()) as Partial<Dish>

    const index = dishes.findIndex((d) => d.id === id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '菜品不存在', data: null },
        { status: 404 }
      )
    }

    // 更新菜品信息
    dishes[index] = {
      ...dishes[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json<Res<Dish>>({
      code: 200,
      message: '更新成功',
      data: dishes[index],
    })
  }),

  /**
   * 删除菜品
   */
  http.delete('/api/admin/dishes/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const index = dishes.findIndex((d) => d.id === id)

    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '菜品不存在', data: null },
        { status: 404 }
      )
    }

    // 删除菜品
    dishes.splice(index, 1)

    return HttpResponse.json<Res<null>>({
      code: 200,
      message: '删除成功',
      data: null,
    })
  }),
]
