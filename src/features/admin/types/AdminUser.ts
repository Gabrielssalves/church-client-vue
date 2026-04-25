export interface AdminUser {
  id: string
  name?: string
  email: string
  active: boolean
  profile?: { id: string; name: string; description?: string }
  createdAt?: string
  updatedAt?: string
}

export interface CreateAdminUserPayload {
  name?: string
  email: string
  password: string
  active?: boolean
  profileId?: string
}

export interface UpdateAdminUserPayload {
  name?: string
  email?: string
  active?: boolean
  profileId?: string
}
