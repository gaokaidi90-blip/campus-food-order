import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'

/**
 * 启动 MSW (Mock Service Worker)
 * 仅在开发环境启用，用于模拟后端 API
 */
async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks')
    console.log('[Admin MSW] Starting worker...')
    return worker.start({
      onUnhandledRequest: 'warn', // 未匹配的请求显示警告
    })
  }
}

enableMocking().then(() => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(ElementPlus, {
    locale: zhCn,
  })

  app.mount('#app')
})
