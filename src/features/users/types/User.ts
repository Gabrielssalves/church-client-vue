import type { SkillColor } from '@/features/skills/types/Skill'

export interface UserSkill {
  id: string
  name: string
  color: SkillColor
}

export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  active: boolean
  skills: UserSkill[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserPayload {
  name: string
  email: string
  phoneNumber: string
  active?: boolean
}

export interface UpdateUserPayload {
  name: string
  email: string
  phoneNumber: string
  active?: boolean
}
