import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vant from 'vant'
import 'vant/lib/index.css'

import App from './App.vue'
import router from './router'

// 启动 MSW
async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks')
    console.log('[MSW] Starting worker...')
    return worker.start({
      onUnhandledRequest: 'warn',
    })
  }
}

enableMocking().then(() => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(Vant)

  app.mount('#app')
})
