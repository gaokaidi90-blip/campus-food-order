import { http, HttpResponse } from 'msw'
import type { Res, UserLoginReq, UserLoginRes } from '@campus-food/shared'
import { users, userPasswords } from '../data/users'

/**
 * 验证用户 token
 * @param request 请求对象
 * @returns 返回 token 字符串，验证失败返回 null
 */
function validateUserToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)
  // 用户 token 格式：user_token_{userId}_{timestamp}
  if (!token.startsWith('user_token_')) return null

  return token
}

export const authHandlers = [
  // 用户登录
  http.post('/api/user/login', async ({ request }) => {
    const body = (await request.json()) as UserLoginReq

    // 查找用户
    const user = users.find((u) => u.studentId === body.studentId)

    // 验证学号和密码
    if (!user || userPasswords[body.studentId] !== body.password) {
      return HttpResponse.json(
        {
          code: 401,
          message: '学号或密码错误',
          data: null,
        },
        { status: 401 }
      )
    }

    // 生成 token（格式：user_token_{userId}_{timestamp}）
    const token = `user_token_${user.id}_${Date.now()}`

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        token,
        user,
      },
    })
  }),

  // 获取用户信息
  http.get('/api/user/profile', ({ request }) => {
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

    // 从 token 中提取用户 ID（格式：user_token_{userId}_{timestamp}）
    const userId = token.split('_')[2]
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return HttpResponse.json(
        {
          code: 404,
          message: '用户不存在',
          data: null,
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: user,
    })
  }),
]

export { validateUserToken }
