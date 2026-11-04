import type { Admin } from '@campus-food/shared'

/**
 * 管理员账号数据
 * 用于开发环境的测试账号
 */
export const admins: Admin[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // 实际项目中密码应加密存储
    name: '系统管理员',
    phone: '13800138000',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    username: 'canteen_admin',
    password: 'admin123',
    name: '食堂管理员',
    phone: '13800138001',
    role: 'admin',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
]
