import { apiHttpClient } from '@/lib/http'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/features/users/types/User'

export const usersService = {
  async getAll(): Promise<User[]> {
    const res = await apiHttpClient.get<User[]>('/users')
    return res.data
  },

  async getOne(id: string): Promise<User> {
    const res = await apiHttpClient.get<User>(`/users/${id}`)
    return res.data
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const res = await apiHttpClient.post<User>('/users', payload)
    return res.data
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const res = await apiHttpClient.put<User>(`/users/${id}`, payload)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await apiHttpClient.delete(`/users/${id}`)
  },

  async registerSkills(userId: string, skillIds: string[]): Promise<User> {
    const res = await apiHttpClient.post<User>(`/users/${userId}/skills`, { skillIds })
    return res.data
  },
}
