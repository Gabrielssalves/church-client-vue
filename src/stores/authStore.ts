import { defineStore } from 'pinia'
import * as authService from '@/services/authService'
import type { User, LoginCredentials, AppError } from '@/types/auth'
import { normalizeError, setAccessToken } from '@/lib/http'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: AppError | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    isAdmin(): boolean {
      return this.user?.claims.includes('admin') ?? false
    },
  },

  actions: {
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

    async logout(): Promise<void> {
      try {
        await authService.logout()
      } catch {
        // intentional
      }
      this.clearSession()
    },

    clearSession(): void {
      this.user = null
      this.error = null
      setAccessToken(null)
      localStorage.removeItem('authUser')
    },

    updateUser(updates: Partial<User>): void {
      if (!this.user) return
      this.user = { ...this.user, ...updates }
      localStorage.setItem('authUser', JSON.stringify(this.user))
    },

    _applySession(user: User | null, accessToken?: string | null): void {
      this.user = user
      setAccessToken(accessToken ?? null)
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user))
      }
    },
  },
})
