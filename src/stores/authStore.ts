import { defineStore } from 'pinia'
import * as authServer from '@/services/authServer'

interface AuthState {
  user: Record<string, unknown> | null
  sessionChecked: boolean
}

interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    sessionChecked: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    initialize() {
      const rawUser = localStorage.getItem('authUser')
      if (rawUser) {
        try {
          this.user = JSON.parse(rawUser)
        } catch {
          localStorage.removeItem('authUser')
        }
      }
    },

    async login(credentials: LoginPayload) {
      const data = await authServer.login(credentials)
      this.user = data.user
      this.sessionChecked = true

      if (data.user) {
        localStorage.setItem('authUser', JSON.stringify(data.user))
      }
    },

    async tryRestoreSession() {
      this.sessionChecked = true
      try {
        const data = await authServer.refresh()
        this.user = data.user

        if (data.user) {
          localStorage.setItem('authUser', JSON.stringify(data.user))
        }
        return true
      } catch {
        await this.logout()
        return false
      }
    },

    async logout() {
      try {
        await authServer.logout()
      } catch {}

      this.user = null
      this.sessionChecked = true
      localStorage.removeItem('authUser')
      localStorage.removeItem('accessToken')
    },

    clearSession() {
      this.user = null
      this.sessionChecked = true
      localStorage.removeItem('authUser')
      localStorage.removeItem('accessToken')
    }
  }
})
