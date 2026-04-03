import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const authStore = useAuthStore()

  const loading = ref(false)
  const error = ref(null)

  async function login(credentials) {
    try {
      loading.value = true
      error.value = null

      await authStore.login(credentials)

    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle(token) {
    try {
      loading.value = true
      error.value = null

      await authStore.loginWithGoogle(token)

    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }
  async function logout() {
    await authStore.logout()
  }

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    loading,
    error,
    login,
    loginWithGoogle,
    logout
  }
}