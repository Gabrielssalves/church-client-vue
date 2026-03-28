import axios from 'axios'

const BASE_URL = 'https://auth-server-aj4e.onrender.com/auth'
const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

export interface AuthPayload {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken?: string | null
  user: Record<string, unknown> | null
}

function getAuthPayload(data: any): any {
  return data?.result ?? data?.data ?? data
}

function normalizeAuthResponse(data: any): AuthResponse {
  const payload = getAuthPayload(data)
  const accessToken = payload?.accessToken || payload?.token || payload?.tokens?.accessToken || null
  const rawUser = payload?.user ?? payload

  const user = { ...rawUser }
  delete (user as any).accessToken
  delete (user as any).token
  delete (user as any).tokens
  delete (user as any).refreshToken
  delete (user as any).user

  return {
    accessToken,
    user: Object.keys(user).length > 0 ? user : null
  }
}

export async function login(payload: AuthPayload): Promise<AuthResponse> {
  const { data } = await authApi.post('/login', payload)
  return normalizeAuthResponse(data)
}

export async function refresh(): Promise<AuthResponse> {
  const { data } = await authApi.post('/refresh')
  return normalizeAuthResponse(data)
}

export async function logout(): Promise<void> {
  await authApi.post('/logout')
}
