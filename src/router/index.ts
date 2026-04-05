import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/login/pages/LoginPage.vue'),
    meta: { requiresAuth: false, label: 'Login', showInSidebar: false, hideSidebar: true }
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/features/home/pages/HomePage.vue'),
    meta: { requiresAuth: true, label: 'Home', showInSidebar: false, icon: 'home' }
  },
  {
    path: '/musicians',
    name: 'Musicians',
    component: () => import('@/features/musicians/MusiciansView.vue'),
    meta: { requiresAuth: true, label: 'Músicos', icon: 'musicians' }
  },
  {
    path: '/draw',
    name: 'Draw',
    meta: { requiresAuth: true, label: 'Sorteio', icon: 'draw' },
    children: [
      {
        path: '',
        name: 'TeamsDraw',
        component: () => import('@/features/teams/pages/DrawPage.vue'),
        meta: { label: 'Sorteio de Times', icon: 'users' }
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    if (!authStore.sessionChecked) {
      const restored = await authStore.tryRestoreSession()
      if (restored) {
        return next()
      }
    }

    return next('/login')
  }

  if (!requiresAuth && isAuthenticated && to.path === '/login') {
    return next('/home')
  }

  next()
})

export default router