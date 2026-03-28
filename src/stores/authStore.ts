import { defineStore } from 'pinia'
import * as authServer from '@/services/authServer'

interface AuthState {
  user: Record<string, unknown> | null
}

interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async login(credentials: LoginPayload) {
      const data = await authServer.login(credentials)
      this.user = data.user
    },

    async tryRestoreSession() {
      try {
        const data = await authServer.refresh()
        this.user = data.user
      } catch {
        this.logout()
      }
    },

    async logout() {
      try {
        await authServer.logout()
      } catch {}

      this.user = null
      localStorage.removeItem('accessToken')
    }
  }
})
