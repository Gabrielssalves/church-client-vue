import { authHttpClient } from '@/lib/http'
import type { AdminUser, CreateAdminUserPayload, UpdateAdminUserPayload } from '@/features/admin/types/AdminUser'

export const adminUsersService = {
  async getAll(): Promise<AdminUser[]> {
    const res = await authHttpClient.get<AdminUser[]>('/users')
    return res.data
  },

  async create(payload: CreateAdminUserPayload): Promise<AdminUser> {
    const res = await authHttpClient.post<AdminUser>('/users', payload)
    return res.data
  },

  async update(id: string, payload: UpdateAdminUserPayload): Promise<AdminUser> {
    const res = await authHttpClient.put<AdminUser>(`/users/${id}`, payload)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await authHttpClient.delete(`/users/${id}`)
  },
}
