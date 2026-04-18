import { apiHttpClient } from '@/lib/http'
import type { Skill, CreateSkillPayload, UpdateSkillPayload } from '@/features/skills/types/Skill'

export const skillsService = {
  async getAll(): Promise<Skill[]> {
    const res = await apiHttpClient.get<Skill[]>('/skills')
    return res.data
  },

  async getOne(id: string): Promise<Skill> {
    const res = await apiHttpClient.get<Skill>(`/skills/${id}`)
    return res.data
  },

  async create(payload: CreateSkillPayload): Promise<Skill> {
    const res = await apiHttpClient.post<Skill>('/skills', payload)
    return res.data
  },

  async update(id: string, payload: UpdateSkillPayload): Promise<Skill> {
    const res = await apiHttpClient.put<Skill>(`/skills/${id}`, payload)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await apiHttpClient.delete(`/skills/${id}`)
  },
}
