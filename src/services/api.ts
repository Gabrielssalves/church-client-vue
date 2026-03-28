import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const BASE_URL = 'https://auth-server-aj4e.onrender.com/auth'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

let isRefreshing = false
let queue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void }> = []

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true

        try {
          await authStore.tryRestoreSession()
          queue.forEach(entry => entry.resolve(null))
          queue = []
        } catch (err) {
          queue.forEach(entry => entry.reject(err))
          queue = []
          authStore.logout()
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }

      return new Promise((resolve, reject) => {
        if (!error.config) return reject(error)

        const retryConfig = error.config
        queue.push({
          resolve: () => resolve(api(retryConfig as AxiosRequestConfig)),
          reject
        })
      })
    }

    return Promise.reject(error)
  }
)

export { api }