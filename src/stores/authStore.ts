import { defineStore } from 'pinia'
import * as authService from '@/services/authService'
import type { User, LoginCredentials, AppError } from '@/types/auth'
import { normalizeError } from '@/lib/http'

interface AuthState {
  user: User | null
  sessionChecked: boolean
  isLoading: boolean
  error: AppError | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    sessionChecked: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    isAdmin(): boolean {
      return true
    },
  },

  actions: {
    /**
     * Called once on app boot (main.ts) to rehydrate user from localStorage
     * without making a network call. A full session validation happens lazily
     * via tryRestoreSession() when a protected route is accessed.
     */
    initialize(): void {
      const rawUser = localStorage.getItem('authUser')
      if (rawUser) {
        try {
          this.user = JSON.parse(rawUser) as User
        } catch {
          localStorage.removeItem('authUser')
        }
      }
    },

    async login(credentials: LoginCredentials): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        const data = await authService.login(credentials)
        this._applySession(data.user, data.accessToken)
      } catch (err) {
        this.error = normalizeError(err)
        throw this.error
      } finally {
        this.isLoading = false
      }
    },

    async loginWithGoogle(token: string): Promise<void> {
      this.isLoading = true
      this.error = null
      try {
        const data = await authService.loginWithGoogle(token)
        this._applySession(data.user, data.accessToken)
      } catch (err) {
        this.error = normalizeError(err)
        throw this.error
      } finally {
        this.isLoading = false
      }
    },

    async tryRestoreSession(): Promise<boolean> {
      this.sessionChecked = true
      try {
        const data = await authService.refresh()
        this._applySession(data.user, data.accessToken)
        return true
      } catch {
        this.clearSession()
        return false
      }
    },

    async logout(): Promise<void> {
      try {
        await authService.logout()
      } catch {
        // Intentional: even if the server call fails, clear local state
      }
      this.clearSession()
    },

    clearSession(): void {
      this.user = null
      this.sessionChecked = true
      this.error = null
      localStorage.removeItem('authUser')
      localStorage.removeItem('accessToken')
    },

    // ---------------------------------------------------------------------------
    // Private helpers (prefixed with _ by convention)
    // ---------------------------------------------------------------------------

    _applySession(user: User | null, accessToken?: string | null): void {
      this.user = user
      this.sessionChecked = true

      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user))
      }
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
      }
    },
  },
})
