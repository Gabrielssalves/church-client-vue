/**
 * useAuth composable
 *
 * Thin façade over the authStore that exposes only what UI components need:
 * reactive user/authentication state, login/logout actions, and local
 * loading/error feedback.
 *
 * The composable re-exposes the store's reactive refs via storeToRefs so
 * that callers have a single reactive source of truth without duplicating state.
 */

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/types/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const { user, isLoading, error } = storeToRefs(authStore)

  const isAuthenticated = computed<boolean>(() => authStore.isAuthenticated)
  const isAdmin = computed<boolean>(() => authStore.isAdmin)

  async function login(credentials: LoginCredentials): Promise<void> {
    await authStore.login(credentials)
  }

  async function loginWithGoogle(token: string): Promise<void> {
    await authStore.loginWithGoogle(token)
  }

  async function logout(): Promise<void> {
    await authStore.logout()
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    loginWithGoogle,
    logout,
  }
}
