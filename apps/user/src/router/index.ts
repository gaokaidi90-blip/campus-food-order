import { createRouter, createWebHistory } from 'vue-router'
import { getStorage } from '@/utils/storage'
import { TOKEN_KEY } from '@campus-food/shared'

// 路由配置
const routes = [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/canteen/:id',
      name: 'canteen-detail',
      component: () => import('@/views/canteen/[id].vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dish/:id',
      name: 'dish-detail',
      component: () => import('@/views/dish/[id].vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/cart/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/address',
      name: 'address-list',
      component: () => import('@/views/address/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/address/edit',
      name: 'address-edit',
      component: () => import('@/views/address/edit.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order',
      name: 'order-list',
      component: () => import('@/views/order/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order/:id',
      name: 'order-detail',
      component: () => import('@/views/order/[id].vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/checkout/index.vue'),
      meta: { requiresAuth: true },
    },
]

console.log('[Router] Total routes:', routes.length)
console.log('[Router] Route paths:', routes.map(r => r.path))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, _from) => {
  const token = getStorage<string>(TOKEN_KEY)
  const requiresAuth = to.meta.requiresAuth !== false

  // 已登录访问登录页，跳转到首页
  if (to.path === '/login' && token) {
    return '/'
  }

  // 需要登录但未登录，跳转到登录页
  if (requiresAuth && !token) {
    return '/login'
  }

  // 其他情况放行
  return true
})

export default router
