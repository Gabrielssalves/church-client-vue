import { apiHttpClient } from '@/lib/http'
import type { Schedule, GenerateSchedulePayload } from '@/features/schedules/types/Schedule'

export const schedulesService = {
  async getAll(): Promise<Schedule[]> {
    const res = await apiHttpClient.get<Schedule[]>('/schedules')
    return res.data
  },

  async getOne(id: string): Promise<Schedule> {
    const res = await apiHttpClient.get<Schedule>(`/schedules/${id}`)
    return res.data
  },

  async create(payload: { name: string; date: string }): Promise<Schedule> {
    const res = await apiHttpClient.post<Schedule>('/schedules/manual', payload)
    return res.data
  },

  async update(id: string, payload: { name?: string; date?: string }): Promise<Schedule> {
    const res = await apiHttpClient.put<Schedule>(`/schedules/${id}`, payload)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await apiHttpClient.delete(`/schedules/${id}`)
  },

  async addUser(scheduleId: string, userId: string, skillId: string): Promise<Schedule> {
    const res = await apiHttpClient.post<Schedule>(`/schedules/${scheduleId}/users`, { userId, skillId })
    return res.data
  },

  async removeUser(scheduleId: string, scheduleUserId: string): Promise<Schedule> {
    const res = await apiHttpClient.delete<Schedule>(`/schedules/${scheduleId}/users/${scheduleUserId}`)
    return res.data
  },

  async generate(payload: GenerateSchedulePayload): Promise<void> {
    await apiHttpClient.post('/schedules/generate', payload)
  },
}
