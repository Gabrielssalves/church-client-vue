import { authHttpClient } from '@/lib/http'
import type { Scope, CreateScopePayload, UpdateScopePayload } from '@/features/admin/types/Scope'

export const adminScopesService = {
  async getAll(): Promise<Scope[]> {
    const res = await authHttpClient.get<Scope[]>('/scopes')
    return res.data
  },

  async create(payload: CreateScopePayload): Promise<Scope> {
    const res = await authHttpClient.post<Scope>('/scopes', payload)
    return res.data
  },

  async update(id: string, payload: UpdateScopePayload): Promise<Scope> {
    const res = await authHttpClient.put<Scope>(`/scopes/${id}`, payload)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await authHttpClient.delete(`/scopes/${id}`)
  },
}
