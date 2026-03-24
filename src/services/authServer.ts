import { api } from './api'

export interface AuthPayload {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: Record<string, unknown>
}

export async function login(payload: AuthPayload): Promise<AuthResponse> {
  const { data } = await api.post('/login', payload)
  return data
}

export async function refresh(): Promise<AuthResponse> {
  const { data } = await api.post('/refresh')
  return data
}

export async function logout(): Promise<void> {
  await api.post('/logout')
}