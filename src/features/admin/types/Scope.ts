export interface Scope {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateScopePayload {
  name: string
  description?: string
}

export interface UpdateScopePayload {
  name: string
  description?: string
}
