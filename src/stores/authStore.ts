import { defineStore } from 'pinia'
import * as authServer from '@/services/authServer'

interface AuthState {
  accessToken: string | null
  user: Record<string, unknown> | null
}

interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken
  },

  actions: {
    async login(credentials: LoginPayload) {
      const data = await authServer.login(credentials)

      this.accessToken = data.accessToken
      this.user = data.user
    },

    setAccessToken(token: string | null) {
      this.accessToken = token
    },

    async tryRestoreSession() {
      try {
        const data = await authServer.refresh()
        this.accessToken = data.accessToken
      } catch {
        this.logout()
      }
    },

    async logout() {
      try {
        await authServer.logout()
      } catch {}

      this.accessToken = null
      this.user = null
    }
  }
})