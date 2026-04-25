import { authHttpClient } from '@/lib/http'
import type { AuthResponse, LoginCredentials, User } from '@/types/auth'

type RawRecord = Record<string, unknown>

function normalize(raw: RawRecord): AuthResponse {
  const payload = (raw.result ?? raw.data ?? raw) as RawRecord
  const userSrc = (payload.user ?? payload) as RawRecord

  const accessToken = (payload.accessToken as string | undefined) ?? null

  const rawScopes = userSrc.scopes ?? userSrc.claims ?? payload.scopes
  const claims = Array.isArray(rawScopes) ? (rawScopes as string[]) : []

  const user: User | null =
    userSrc.id || userSrc.email
      ? {
          id: userSrc.id as string | undefined,
          name: userSrc.name as string | undefined,
          email: userSrc.email as string | undefined,
          picture: userSrc.picture as string | undefined,
          claims,
        }
      : null

  return { accessToken, user }
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await authHttpClient.post<RawRecord>('/auth/login', credentials)
  return normalize(data)
}

export async function loginWithGoogle(token: string): Promise<AuthResponse> {
  const { data } = await authHttpClient.post<RawRecord>('/auth/google', { token })
  return normalize(data)
}

export async function refresh(): Promise<AuthResponse> {
  const { data } = await authHttpClient.post<RawRecord>('/auth/refresh')
  return normalize(data)
}

export async function logout(): Promise<void> {
  await authHttpClient.post('/auth/logout')
}
