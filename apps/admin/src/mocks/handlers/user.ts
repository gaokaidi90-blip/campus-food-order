import { http, HttpResponse } from 'msw'
import type { Res, User, PageRes } from '@campus-food/shared'
import { users, saveUsers } from '../data'
import { validateAdminToken } from './auth'

export const userHandlers = [
  /**
   * 获取用户列表（只读）
   * 支持关键词搜索
   */
  http.get('/api/admin/users', ({ request }) => {
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
    let filtered = users
    if (keyword) {
      filtered = users.filter(
        (u) =>
          u.name.includes(keyword) ||
          u.studentId.includes(keyword) ||
          u.phone?.includes(keyword)
      )
    }

    // 分页
    const total = filtered.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filtered.slice(start, end)

    return HttpResponse.json<Res<PageRes<User>>>({
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
   * 获取用户详情（只读）
   */
  http.get('/api/admin/users/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const user = users.find((u) => u.id === id)

    if (!user) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '用户不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json<Res<User>>({
      code: 200,
      message: 'success',
      data: user,
    })
  }),

  /**
   * 更新用户信息
   */
  http.put('/api/admin/users/:id', async ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const { id } = params
    const body = (await request.json()) as { name: string; phone: string; avatar: string }

    const index = users.findIndex((u) => u.id === id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '用户不存在', data: null },
        { status: 404 }
      )
    }

    // 更新用户信息
    users[index] = {
      ...users[index],
      name: body.name,
      phone: body.phone,
      avatar: body.avatar,
      updatedAt: new Date().toISOString(),
    }

    saveUsers()

    return HttpResponse.json<Res<User>>({
      code: 200,
      message: '更新成功',
      data: users[index],
    })
  }),
]
