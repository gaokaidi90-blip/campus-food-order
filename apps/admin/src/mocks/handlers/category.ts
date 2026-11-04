import { http, HttpResponse } from 'msw'
import type { Res, Category } from '@campus-food/shared'
import { categories } from '../data'
import { validateAdminToken } from './auth'

export const categoryHandlers = [
  /**
   * 获取分类列表
   * 支持按食堂 ID 过滤和关键词搜索
   */
  http.get('/api/admin/categories', ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const canteenId = url.searchParams.get('canteenId') || ''
    const keyword = url.searchParams.get('keyword') || ''

    // 根据条件过滤
    let filtered = categories
    if (canteenId) {
      filtered = filtered.filter((c) => c.canteenId === canteenId)
    }
    if (keyword) {
      filtered = filtered.filter((c) => c.name.includes(keyword))
    }

    return HttpResponse.json<Res<Category[]>>({
      code: 200,
      message: 'success',
      data: filtered,
    })
  }),

  /**
   * 获取分类详情
   */
  http.get('/api/admin/categories/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const category = categories.find((c) => c.id === id)

    if (!category) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '分类不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json<Res<Category>>({
      code: 200,
      message: 'success',
      data: category,
    })
  }),

  /**
   * 创建分类
   */
  http.post('/api/admin/categories', async ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>

    // 创建新分类
    const newCategory: Category = {
      ...body,
      id: `${categories.length + 1}`,
      sort: body.sort ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    categories.push(newCategory)

    return HttpResponse.json<Res<Category>>({
      code: 200,
      message: '创建成功',
      data: newCategory,
    })
  }),

  /**
   * 更新分类
   */
  http.put('/api/admin/categories/:id', async ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const body = (await request.json()) as Partial<Category>

    const index = categories.findIndex((c) => c.id === id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '分类不存在', data: null },
        { status: 404 }
      )
    }

    // 更新分类信息
    categories[index] = {
      ...categories[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json<Res<Category>>({
      code: 200,
      message: '更新成功',
      data: categories[index],
    })
  }),

  /**
   * 删除分类
   */
  http.delete('/api/admin/categories/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const index = categories.findIndex((c) => c.id === id)

    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '分类不存在', data: null },
        { status: 404 }
      )
    }

    // 删除分类
    categories.splice(index, 1)

    return HttpResponse.json<Res<null>>({
      code: 200,
      message: '删除成功',
      data: null,
    })
  }),
]
