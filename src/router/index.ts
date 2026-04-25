import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
    requiredScope?: string
    label?: string
    icon?: string
    showInSidebar?: boolean
    hideSidebar?: boolean
  }
}

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
    meta: { requiresAuth: true, requiredScope: 'users', label: 'nav.users', icon: 'users' },
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('@/features/skills/SkillsView.vue'),
    meta: { requiresAuth: true, requiredScope: 'skills', label: 'nav.skills', icon: 'skills' },
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: () => import('@/features/schedules/SchedulesView.vue'),
    meta: { requiresAuth: true, requiredScope: 'schedules', label: 'nav.schedules', icon: 'schedules' },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/features/profile/ProfilePage.vue'),
    meta: { requiresAuth: true, showInSidebar: false },
  },
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/scopes',
    meta: { requiresAuth: true, requiresAdmin: true, label: 'nav.admin', icon: 'shield' },
    children: [
      {
        path: 'scopes',
        name: 'AdminScopes',
        component: () => import('@/features/admin/ScopesView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, label: 'nav.admin_scopes', icon: 'key' },
      },
      {
        path: 'profiles',
        name: 'AdminProfiles',
        component: () => import('@/features/admin/ProfilesView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, label: 'nav.admin_profiles', icon: 'group' },
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/features/admin/AdminUsersView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, label: 'nav.admin_users', icon: 'user' },
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

function hasRequiredScope(claims: string[], resource: string): boolean {
  return claims.some(
    c => c === `${resource}:read` || c === `${resource}:write` || c === `${resource}:delete`,
  )
}

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'Dashboard' })
  }

  if (to.meta.requiredScope && !authStore.isAdmin) {
    const claims = authStore.user?.claims ?? []
    if (!hasRequiredScope(claims, to.meta.requiredScope)) {
      return next({ name: 'Dashboard' })
    }
  }

  return next()
})

export default router
