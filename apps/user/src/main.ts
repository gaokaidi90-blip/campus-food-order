import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 启动 MSW
async function enableMocking() {
  if (import.meta.env.MODE === 'development') {
    const { worker } = await import('./mocks')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

enableMocking().then(() => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
})
