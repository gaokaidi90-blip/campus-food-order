import { createRouter, createWebHistory } from 'vue-router'
import { getStorage, setStorage } from '@/utils/storage'
import { ADMIN_TOKEN_KEY } from '@campus-food/shared'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
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
          meta: { requiresAuth: true },
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
 * 验证管理员登录状态
 */
router.beforeEach((to) => {
  // 如果 URL 中包含 token 参数，保存到 localStorage
  if (to.query.token && typeof to.query.token === 'string') {
    console.log('从 URL 获取到 token，保存到 localStorage')
    setStorage(ADMIN_TOKEN_KEY, to.query.token)
    // 移除 URL 中的 token 参数，重定向到干净的 URL
    const { token, ...restQuery } = to.query
    return {
      path: to.path,
      query: restQuery,
      replace: true,
    }
  }

  const token = getStorage<string>(ADMIN_TOKEN_KEY)
  const requiresAuth = to.meta.requiresAuth !== false

  // 已登录访问登录页，跳转到首页
  if (to.path === '/login' && token) {
    return '/dashboard'
  }

  // 需要登录但未登录，跳转到用户端统一登录页（管理员标签）
  if (requiresAuth && !token) {
    window.location.href = 'http://localhost:3000/login?redirect=admin'
    return false
  }

  // 其他情况放行
  return true
})

export default router
