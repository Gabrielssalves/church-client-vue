import { authHttpClient } from '@/lib/http'
import type { Profile, CreateProfilePayload, UpdateProfilePayload } from '@/features/admin/types/Profile'

export const adminProfilesService = {
  async getAll(): Promise<Profile[]> {
    const res = await authHttpClient.get<Profile[]>('/profiles')
    return res.data
  },

  async create(payload: CreateProfilePayload): Promise<Profile> {
    const res = await authHttpClient.post<Profile>('/profiles', payload)
    return res.data
  },

  async update(id: string, payload: UpdateProfilePayload): Promise<Profile> {
    const res = await authHttpClient.put<Profile>(`/profiles/${id}`, payload)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await authHttpClient.delete(`/profiles/${id}`)
  },
}
