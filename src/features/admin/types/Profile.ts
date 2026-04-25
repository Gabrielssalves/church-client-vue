import type { Scope } from './Scope'

export interface Profile {
  id: string
  name: string
  description?: string
  scopes: Scope[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateProfilePayload {
  name: string
  description?: string
  scopeIds?: string[]
}

export interface UpdateProfilePayload {
  name: string
  description?: string
  scopeIds?: string[]
}
