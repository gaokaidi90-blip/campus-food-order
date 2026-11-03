import { http, HttpResponse } from 'msw'
import type { Res, UserLoginReq, UserLoginRes } from '@campus-food/shared'
import { users, userPasswords } from '../data/users'

/**
 * 管理员账号数据（用于统一登录页）
 */
const admins = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: '系统管理员',
    phone: '13800138000',
    role: 'admin',
  },
  {
    id: '2',
    username: 'canteen_admin',
    password: 'admin123',
    name: '食堂管理员',
    phone: '13800138001',
    role: 'admin',
  },
]

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

  /**
   * 管理员登录（用于统一登录页）
   * 验证用户名和密码，返回 admin token
   */
  http.post('/api/admin/login', async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string }

    // 查找管理员账号
    const admin = admins.find(
      (a) => a.username === body.username && a.password === body.password
    )

    if (!admin) {
      return HttpResponse.json<Res<null>>(
        {
          code: 401,
          message: '用户名或密码错误',
          data: null,
        },
        { status: 401 }
      )
    }

    // 生成管理员 token (格式: admin_token_{adminId}_{timestamp})
    const token = `admin_token_${admin.id}_${Date.now()}`

    return HttpResponse.json<Res<{ token: string; admin: Omit<typeof admin, 'password'> }>>({
      code: 200,
      message: 'success',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          phone: admin.phone,
          role: admin.role,
        },
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
