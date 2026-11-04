import { http, HttpResponse } from 'msw'
import type { Res, Canteen, PageRes } from '@campus-food/shared'
import { canteens } from '../data'
import { validateAdminToken } from './auth'

export const canteenHandlers = [
  /**
   * 获取食堂列表
   * 支持分页和搜索
   */
  http.get('/api/admin/canteens', ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword') || ''
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    // 根据关键词过滤
    let filtered = canteens
    if (keyword) {
      filtered = canteens.filter(
        (c) => c.name.includes(keyword) || c.description.includes(keyword)
      )
    }

    // 分页
    const total = filtered.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filtered.slice(start, end)

    return HttpResponse.json<Res<PageRes<Canteen>>>({
      code: 200,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
      },
    })
  }),

  /**
   * 获取食堂详情
   */
  http.get('/api/admin/canteens/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const canteen = canteens.find((c) => c.id === id)

    if (!canteen) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '食堂不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json<Res<Canteen>>({
      code: 200,
      message: 'success',
      data: canteen,
    })
  }),

  /**
   * 创建食堂
   */
  http.post('/api/admin/canteens', async ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as Omit<Canteen, 'id' | 'createdAt' | 'updatedAt'>

    // 创建新食堂
    const newCanteen: Canteen = {
      ...body,
      id: `${canteens.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    canteens.push(newCanteen)

    return HttpResponse.json<Res<Canteen>>({
      code: 200,
      message: '创建成功',
      data: newCanteen,
    })
  }),

  /**
   * 更新食堂
   */
  http.put('/api/admin/canteens/:id', async ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const body = (await request.json()) as Partial<Canteen>

    const index = canteens.findIndex((c) => c.id === id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '食堂不存在', data: null },
        { status: 404 }
      )
    }

    // 更新食堂信息
    canteens[index] = {
      ...canteens[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json<Res<Canteen>>({
      code: 200,
      message: '更新成功',
      data: canteens[index],
    })
  }),

  /**
   * 删除食堂
   */
  http.delete('/api/admin/canteens/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const index = canteens.findIndex((c) => c.id === id)

    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '食堂不存在', data: null },
        { status: 404 }
      )
    }

    // 删除食堂
    canteens.splice(index, 1)

    return HttpResponse.json<Res<null>>({
      code: 200,
      message: '删除成功',
      data: null,
    })
  }),
]
