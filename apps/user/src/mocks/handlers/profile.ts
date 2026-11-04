import { http, HttpResponse } from 'msw'
import type { Res, User } from '@campus-food/shared'
import { users } from '../data'
import { validateUserToken } from './auth'

export const profileHandlers = [
  /**
   * 获取用户个人信息
   * 根据 token 中的用户 ID 返回用户信息
   */
  http.get('/api/user/profile', ({ request }) => {
    // 验证用户 token
    const token = validateUserToken(request)

    if (!token) {
      return HttpResponse.json<Res<null>>(
        {
          code: 401,
          message: '未授权访问',
          data: null,
        },
        { status: 401 }
      )
    }

    // 从 token 中提取用户 ID (格式: user_token_{userId}_{timestamp})
    const userId = token.split('_')[2]
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return HttpResponse.json<Res<null>>(
        {
          code: 404,
          message: '用户不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 返回用户信息（排除密码字段）
    const { password, ...userInfo } = user

    return HttpResponse.json<Res<Omit<User, 'password'>>>({
      code: 200,
      message: 'success',
      data: userInfo,
    })
  }),

  /**
   * 更新用户个人信息
   */
  http.put('/api/user/profile', async ({ request }) => {
    // 验证用户 token
    const token = validateUserToken(request)

    if (!token) {
      return HttpResponse.json<Res<null>>(
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
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return HttpResponse.json<Res<null>>(
        {
          code: 404,
          message: '用户不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    // 获取请求体
    const body = await request.json() as { name?: string; avatar?: string }

    // 更新用户信息
    if (body.name !== undefined) {
      user.name = body.name
    }
    if (body.avatar !== undefined) {
      user.avatar = body.avatar
    }

    // 返回更新后的用户信息
    const { password, ...userInfo } = user

    return HttpResponse.json<Res<Omit<User, 'password'>>>({
      code: 200,
      message: 'success',
      data: userInfo,
    })
  }),
]
