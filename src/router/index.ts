import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/login/pages/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      label: 'Login',
      showInSidebar: false,
      hideSidebar: true,
    },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/features/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true, label: 'Dashboard', icon: 'home' },
  },
  {
    path: '/musicians',
    name: 'Musicians',
    component: () => import('@/features/musicians/MusiciansView.vue'),
    meta: { requiresAuth: true, label: 'Músicos', icon: 'musicians' },
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
        meta: { label: 'Sorteio de Times', icon: 'users' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// ---------------------------------------------------------------------------
// Global navigation guard — auth protection
// ---------------------------------------------------------------------------

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth) {
    if (authStore.isAuthenticated) {
      return next()
    }

    // Session not yet validated — attempt a silent token refresh once
    if (!authStore.sessionChecked) {
      const restored = await authStore.tryRestoreSession()
      if (restored) {
        return next()
      }
    }

    return next({ name: 'Login' })
  }

  // Redirect authenticated users away from the login page
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  return next()
})

export default router
