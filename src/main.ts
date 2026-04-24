import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { i18n } from '@/plugins/i18n'
import { vTooltip } from '@/directives/tooltip'

import App from '@/App.vue'
import router from './router'

import '@/assets/global.css'

const app = createApp(App)
app.directive('tooltip', vTooltip)

app.use(createPinia())
app.use(i18n)

const authStore = useAuthStore()

authStore.initialize()

app.use(router)

app.mount('#app')

const preloader = document.getElementById('preloader')
if (preloader) {
  preloader.remove()
}
