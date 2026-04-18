export interface ScheduleUser {
  id: string
  userId: string
  skillId: string
}

export interface Schedule {
  id: string
  name: string
  date: string
  users: ScheduleUser[]
  createdAt?: string
  updatedAt?: string
}

export interface SkillConfig {
  skillId: string
  priority: number
  minimunRestDays: number
}

export interface GenerateSchedulePayload {
  startDate: string
  endDate: string
  daysOfWeek: string[]
  skillConfigs: SkillConfig[]
}
