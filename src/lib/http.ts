/**
 * Centralised Axios HTTP client.
 *
 * All API communication in the app should import from here rather than
 * creating ad-hoc axios instances. This gives a single place to manage:
 *   - Base URL configuration
 *   - Auth token injection (request interceptor)
 *   - Normalised error handling (response interceptor)
 *   - withCredentials for cookie-based sessions
 */

import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { env } from '@/config/env'
import type { AppError } from '@/types/auth'

// ---------------------------------------------------------------------------
// Error normalisation
// ---------------------------------------------------------------------------

export function normalizeError(err: unknown): AppError {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{ message?: string; code?: string }>
    return {
      message: axiosErr.response?.data?.message ?? axiosErr.message,
      code: axiosErr.response?.data?.code ?? 'NETWORK_ERROR',
      statusCode: axiosErr.response?.status,
    }
  }
  if (err instanceof Error) {
    return { message: err.message, code: 'UNKNOWN_ERROR' }
  }
  return { message: 'An unexpected error occurred', code: 'UNKNOWN_ERROR' }
}

// ---------------------------------------------------------------------------
// Factory — exported so feature-level services can create scoped instances
// ---------------------------------------------------------------------------

export function createHttpClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor — attach access token when present
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Response interceptor — unwrap data and surface errors uniformly
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
      const appError = normalizeError(error)

      // 401 → clear stale token; the router guard will redirect to /login
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('authUser')
      }

      return Promise.reject(appError)
    }
  )

  return instance
}

// ---------------------------------------------------------------------------
// Default auth HTTP client — used by authService
// ---------------------------------------------------------------------------

export const authHttpClient = createHttpClient(env.authBaseUrl)
