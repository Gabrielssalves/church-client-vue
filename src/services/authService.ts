/**
 * Authentication service layer.
 *
 * All auth-related HTTP calls live here. Uses the shared authHttpClient from
 * @/lib/http so interceptors (token injection, 401 handling) apply automatically.
 *
 * This file was previously named authServer.ts — renamed to authService.ts to
 * match the import in authStore.ts and the service-layer naming convention.
 */

import { authHttpClient } from '@/lib/http'
import type { AuthResponse, LoginCredentials, User } from '@/types/auth'

// ---------------------------------------------------------------------------
// Raw API shape — what the server actually returns (varies by backend)
// ---------------------------------------------------------------------------

interface RawTokens {
  accessToken?: string
  refreshToken?: string
}

interface RawApiResponse {
  result?: RawApiPayload
  data?: RawApiPayload
  accessToken?: string
  token?: string
  tokens?: RawTokens
  user?: RawApiUser
  [key: string]: unknown
}

interface RawApiPayload {
  accessToken?: string
  token?: string
  tokens?: RawTokens
  user?: RawApiUser
  [key: string]: unknown
}

interface RawApiUser {
  id?: string
  name?: string
  email?: string
  picture?: string
  claims?: unknown
  scopes?: unknown
  accessToken?: string
  token?: string
  tokens?: RawTokens
  refreshToken?: string
  user?: unknown
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Response normalisation helpers
// ---------------------------------------------------------------------------

function extractPayload(data: RawApiResponse): RawApiPayload {
  return data?.result ?? data?.data ?? data
}

function normalizeAuthResponse(data: RawApiResponse): AuthResponse {
  const payload = extractPayload(data)

  const accessToken =
    payload?.accessToken ??
    payload?.token ??
    payload?.tokens?.accessToken ??
    null

  const rawUser: RawApiUser = { ...(payload?.user ?? payload) }

  // Strip auth metadata so the stored User object stays clean
  const keysToRemove: (keyof RawApiUser)[] = [
    'accessToken',
    'token',
    'tokens',
    'refreshToken',
    'user',
  ]
  for (const key of keysToRemove) {
    delete rawUser[key]
  }

  const user: User | null =
    Object.keys(rawUser).length > 0
      ? {
          id: typeof rawUser.id === 'string' ? rawUser.id : undefined,
          name: typeof rawUser.name === 'string' ? rawUser.name : undefined,
          email: typeof rawUser.email === 'string' ? rawUser.email : undefined,
          picture: typeof rawUser.picture === 'string' ? rawUser.picture : undefined,
          claims: Array.isArray(rawUser.scopes)
            ? (rawUser.scopes as string[])
            : Array.isArray(rawUser.claims)
              ? (rawUser.claims as string[])
              : undefined,
        }
      : null

  return { accessToken, user }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await authHttpClient.post<RawApiResponse>('/auth/login', credentials)
  return normalizeAuthResponse(data)
}

export async function loginWithGoogle(token: string): Promise<AuthResponse> {
  const { data } = await authHttpClient.post<RawApiResponse>('/auth/google', { token })
  return normalizeAuthResponse(data)
}

export async function refresh(): Promise<AuthResponse> {
  const { data } = await authHttpClient.post<RawApiResponse>('/auth/refresh')
  return normalizeAuthResponse(data)
}

export async function logout(): Promise<void> {
  await authHttpClient.post('/auth/logout')
}
