import { defineStore } from 'pinia'
import * as authService from '@/services/authService'
import type { User, LoginCredentials, AppError } from '@/types/auth'
import { normalizeError } from '@/lib/http'

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]!) : undefined
}

function decodeJwtScopes(token: string): string[] | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!)) as Record<string, unknown>
    const scopes = payload.scopes ?? payload.claims
    return Array.isArray(scopes) ? (scopes as string[]) : undefined
  } catch {
    return undefined
  }
}

function enrichWithCookieScopes(user: User): void {
  if (user.claims?.length) return
  const token = getCookie('Authentication')
  if (!token) return
  const scopes = decodeJwtScopes(token)
  if (scopes) user.claims = scopes
}

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
      return Array.isArray(this.user?.claims) && this.user!.claims!.includes('admin')
    },
  },

  actions: {
    initialize(): void {
      const rawUser = localStorage.getItem('authUser')
      if (rawUser) {
        try {
          const user = JSON.parse(rawUser) as User
          enrichWithCookieScopes(user)
          this.user = user
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
        await this._applySession(data.user)
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
        await this._applySession(data.user)
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
        await this._applySession(data.user)
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
      cookieStore.delete('Authentication')
    },

    updateUser(updates: Partial<User>): void {
      if (!this.user) return
      this.user = { ...this.user, ...updates }
      localStorage.setItem('authUser', JSON.stringify(this.user))
    },

    // ---------------------------------------------------------------------------
    // Private helpers (prefixed with _ by convention)
    // ---------------------------------------------------------------------------

    async _applySession(user: User | null): Promise<void> {
      if (user && !user.claims?.length) {
        try {
          const cookie = await cookieStore.get('Authentication')
          const scopes = cookie?.value ? decodeJwtScopes(cookie.value) : undefined
          if (scopes) user.claims = scopes
        } catch {
          // cookieStore unavailable (e.g. SSR / old browser) — fall back to sync read
          enrichWithCookieScopes(user)
        }
      }
      this.user = user
      this.sessionChecked = true
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user))
      }
    },
  },
})
