import { createRouter, createWebHistory } from 'vue-router'
import { getStorage, setStorage } from '@/utils/storage'
import { ADMIN_TOKEN_KEY } from '@campus-food/shared'
import { useAdminStore } from '@/stores/admin'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      // Keep the legacy URL working, but send it to the shared login app.
      component: () => import('@/views/dashboard/index.vue'),
      beforeEnter: (to) => {
        const loginUrl = new URL('http://localhost:3000/login')
        loginUrl.searchParams.set('redirect', 'admin')
        if (typeof to.query.returnTo === 'string') {
          loginUrl.searchParams.set('returnTo', to.query.returnTo)
        }
        window.location.href = loginUrl.toString()
        return false
      },
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layout/AdminLayout.vue'),
      redirect: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'canteen',
          name: 'canteen',
          component: () => import('@/views/canteen/index.vue'),
          meta: { requiresAuth: true, requiresSuperAdmin: true },
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('@/views/category/index.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'dish',
          name: 'dish',
          component: () => import('@/views/dish/index.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('@/views/order/index.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/user/index.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

/**
 * 路由守卫
 * 验证管理员登录状态和权限
 */
router.beforeEach((to) => {
  // 如果 URL 中包含 token 参数，保存到 localStorage
  if (to.query.token && typeof to.query.token === 'string') {
    console.log('从 URL 获取到 token，保存到 localStorage')
    setStorage(ADMIN_TOKEN_KEY, to.query.token)
    const adminStore = useAdminStore()
    const role = to.query.adminRole
    const adminId = to.query.adminId
    const username = to.query.adminUsername
    if (
      (role === 'admin' || role === 'superadmin') &&
      typeof adminId === 'string' &&
      typeof username === 'string'
    ) {
      adminStore.adminInfo = {
        id: adminId,
        username,
        name: username,
        phone: '',
        role,
        canteenId: typeof to.query.canteenId === 'string' ? Number(to.query.canteenId) : null,
        createdAt: '',
        updatedAt: '',
      }
    }
    // 移除 URL 中的 token 参数，重定向到干净的 URL
    const { token, adminRole, adminId: _adminId, adminUsername, canteenId, ...restQuery } = to.query
    return {
      path: to.path,
      query: restQuery,
      replace: true,
    }
  }

  const token = getStorage<string>(ADMIN_TOKEN_KEY)
  const adminStore = useAdminStore()
  if (token) {
    adminStore.restoreFromToken()
  }
  const requiresAuth = to.meta.requiresAuth !== false

  // 已登录访问登录页，跳转到首页
  if (to.path === '/login' && token) {
    return typeof to.query.returnTo === 'string' ? to.query.returnTo : '/dashboard'
  }

  // 需要登录但未登录，跳转到用户端统一登录页（管理员标签）
  if (requiresAuth && !token) {
    const loginUrl = new URL('http://localhost:3000/login')
    loginUrl.searchParams.set('redirect', 'admin')
    loginUrl.searchParams.set('returnTo', to.fullPath)
    window.location.href = loginUrl.toString()
    return false
  }

  // 超级管理员权限检查
  if (to.meta.requiresSuperAdmin) {
    if (!adminStore.isSuperAdmin) {
      // 非超级管理员访问超级管理员专属页面，跳转到首页
      return '/dashboard'
    }
  }

  // 其他情况放行
  return true
})

export default router
