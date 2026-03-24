import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

import App from '@/App.vue'
import router from './router'

import '@/assets/global.css'

const app = createApp(App)

app.use(createPinia())

const authStore = useAuthStore()

await authStore.tryRestoreSession()

app.use(router)

app.mount('#app')
