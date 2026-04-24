export interface User {
  id?: string
  name?: string
  email?: string
  picture?: string
  claims?: string[]
  [key: string]: unknown
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken?: string | null
  user: User | null
}

export interface AppError {
  message: string
  code: string
  statusCode?: number
}
