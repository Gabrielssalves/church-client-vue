export interface AdminUser {
  id: string
  name?: string
  email: string
  active: boolean
  profiles: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateAdminUserPayload {
  name?: string
  email: string
  password: string
  active?: boolean
  profiles?: string[]
}

export interface UpdateAdminUserPayload {
  name?: string
  email?: string
  active?: boolean
  profiles?: string[]
}
