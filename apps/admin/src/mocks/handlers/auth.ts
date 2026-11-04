import { http, HttpResponse } from 'msw'
import type { Res } from '@campus-food/shared'
import { admins } from '../data'

/**
 * 验证管理员 token
 * Token 格式：admin_token_{adminId}_{timestamp}
 * @param request 请求对象
 * @returns token 字符串或 null
 */
export function validateAdminToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  // 检查是否为管理员 token（必须以 admin_token_ 开头）
  if (!token.startsWith('admin_token_')) {
    return null
  }

  return token
}

export const authHandlers = [
  /**
   * 管理员登录
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
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        },
      },
    })
  }),
]
