import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const BASE_URL = 'https://auth-server-aj4e.onrender.com/auth'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore()

  if (authStore.accessToken) {
    if (!config.headers) config.headers = {} as any
    (config.headers as Record<string, string>).Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

let isRefreshing = false
let queue: Array<(token: string) => void> = []

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true

        try {
          const { data } = await refreshApi.post(
            '/refresh',
            {},
            { withCredentials: true }
          )

          authStore.setAccessToken(data.accessToken)

          queue.forEach(cb => cb(data.accessToken))
          queue = []

        } catch (err) {
          authStore.logout()
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }

      return new Promise((resolve, reject) => {
        if (!error.config) return reject(error)

        const retryConfig = error.config

        queue.push((token) => {
          if (!retryConfig.headers) {
            retryConfig.headers = {} as any
          }

          (retryConfig.headers as Record<string, string>).Authorization = `Bearer ${token}`
          resolve(api(retryConfig as AxiosRequestConfig))
        })
      })
    }

    return Promise.reject(error)
  }
)

export { api }