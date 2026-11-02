import { createRouter, createWebHistory } from 'vue-router'
import { getStorage } from '@/utils/storage'
import { TOKEN_KEY } from '@campus-food/shared'

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
  ],
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = getStorage<string>(TOKEN_KEY)
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !token) {
    // 需要登录但未登录，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 已登录访问登录页，跳转到首页
    next('/')
  } else {
    next()
  }
})

export default router
