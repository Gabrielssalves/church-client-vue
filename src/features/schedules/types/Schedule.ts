export interface ScheduleUser {
  id: string
  userId: string
  skillId: string
}

export interface Schedule {
  id: string
  name: string
  date: string
  startTime?: string | null
  endTime?: string | null
  users: ScheduleUser[]
  createdAt?: string
  updatedAt?: string
}

export interface SkillConfig {
  skillId: string
  priority: number
  minimunRestDays: number
}

export interface UserGroup {
  userIds: string[]
}

export interface ScheduleReservation {
  weekOfMonth: number
  dayOfWeek: string
  userId: string
  skillId: string
}

export interface GenerateSchedulePayload {
  startDate: string
  endDate: string
  daysOfWeek: string[]
  skillConfigs: SkillConfig[]
  startTime?: string
  endTime?: string
  groups?: UserGroup[]
  reservations?: ScheduleReservation[]
}
