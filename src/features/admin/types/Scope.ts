export interface Scope {
  id: string
  name: string
  code?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateScopePayload {
  name: string
  code?: string
  description?: string
}

export interface UpdateScopePayload {
  name: string
  code?: string
  description?: string
}
