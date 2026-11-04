import { http, HttpResponse } from 'msw'
import type { Res, User } from '@campus-food/shared'
import { users } from '../data'
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

    return HttpResponse.json<Res<User[]>>({
      code: 200,
      message: 'success',
      data: filtered,
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
]
