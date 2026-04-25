import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/config/env'
import type { AppError } from '@/types/auth'

let _accessToken: string | null = null

export function setAccessToken(token: string | null): void {
  _accessToken = token
}

let _isRefreshing = false
let _pendingRequests: Array<(token: string | null) => void> = []

function flushQueue(token: string | null): void {
  _pendingRequests.forEach(resolve => resolve(token))
  _pendingRequests = []
}

function extractAccessToken(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>
  const payload = (d.result ?? d.data ?? d) as Record<string, unknown>
  return (payload.accessToken as string | undefined) ?? null
}

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

export function createHttpClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(normalizeError(error))
      }

      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(normalizeError(error))
      }

      if (_isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          _pendingRequests.push(token => {
            if (!token) return reject(normalizeError(error))
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(instance(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      _isRefreshing = true

      try {
        const res = await axios.post(
          `${env.authBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true },
        )
        const newToken = extractAccessToken(res.data)
        setAccessToken(newToken)
        flushQueue(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return instance(originalRequest)
      } catch {
        setAccessToken(null)
        localStorage.removeItem('authUser')
        flushQueue(null)
        window.location.replace('/#/login')
        return Promise.reject(normalizeError(error))
      } finally {
        _isRefreshing = false
      }
    },
  )

  return instance
}

export const authHttpClient = createHttpClient(env.authBaseUrl)
export const externalIntegrationsHttpClient = createHttpClient(env.externalIntegrationsBaseUrl)
export const apiHttpClient = createHttpClient(env.apiBaseUrl)
