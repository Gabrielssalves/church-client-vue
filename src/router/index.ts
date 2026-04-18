import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/login/pages/LoginPage.vue'),
    meta: { requiresAuth: false, label: 'nav.login', showInSidebar: false, hideSidebar: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/features/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true, label: 'nav.dashboard', icon: 'home' },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/features/users/UsersView.vue'),
    meta: { requiresAuth: true, label: 'nav.users', icon: 'users' },
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('@/features/skills/SkillsView.vue'),
    meta: { requiresAuth: true, label: 'nav.skills', icon: 'skills' },
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: () => import('@/features/schedules/SchedulesView.vue'),
    meta: { requiresAuth: true, label: 'nav.schedules', icon: 'schedules' },
  },
  {
    path: '/draw',
    name: 'Draw',
    meta: { requiresAuth: true, label: 'nav.draw', icon: 'draw' },
    children: [
      {
        path: '',
        name: 'TeamsDraw',
        component: () => import('@/features/teams/pages/DrawPage.vue'),
        meta: { label: 'nav.teams_draw', icon: 'users' },
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

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth) {
    if (authStore.isAuthenticated) return next()
    if (!authStore.sessionChecked) {
      const restored = await authStore.tryRestoreSession()
      if (restored) return next()
    }
    return next({ name: 'Login' })
  }

  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  return next()
})

export default router
