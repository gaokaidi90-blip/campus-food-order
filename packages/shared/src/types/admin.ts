/**
 * 管理员实体
 */
export interface Admin {
  id: string
  username: string
  password: string
  name: string
  phone: string
  role: 'admin' | 'superadmin'
  avatar?: string
  createdAt: string
  updatedAt: string
}

/**
 * 管理员登录请求
 */
export interface AdminLoginReq {
  username: string
  password: string
}

/**
 * 管理员登录响应
 */
export interface AdminLoginRes {
  token: string
  admin: Admin
}

/**
 * 数据看板统计
 */
export interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  totalUsers: number
  totalOrders: number
  orderStatusStats: {
    pending: number
    accepted: number
    ready: number
    cancelled: number
  }
}
