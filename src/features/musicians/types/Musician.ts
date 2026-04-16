import type { BadgeColor } from '@/types/ui'

export interface Skill {
  id: string
  name: string
  /** Badge colour — must be one of the tokens supported by BaseBadge. */
  color: BadgeColor
}

export interface Musician {
  id: string
  name: string
  email?: string
  skills: Skill[]
}
