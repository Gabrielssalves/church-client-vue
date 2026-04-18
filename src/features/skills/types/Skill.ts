import type { BadgeColor } from '@/types/ui'

export type SkillColor = BadgeColor

export const SKILL_COLORS: SkillColor[] = [
  'green', 'teal', 'blue', 'indigo', 'purple',
  'pink', 'red', 'orange', 'yellow', 'lime', 'cyan', 'gray',
]

export const SKILL_COLOR_LABELS: Record<SkillColor, string> = {
  green: 'Verde',
  teal: 'Turquesa',
  blue: 'Azul',
  indigo: 'Índigo',
  purple: 'Roxo',
  pink: 'Rosa',
  red: 'Vermelho',
  orange: 'Laranja',
  yellow: 'Amarelo',
  lime: 'Lima',
  cyan: 'Ciano',
  gray: 'Cinza',
}

export interface Skill {
  id: string
  name: string
  color: SkillColor
  createdAt?: string
  updatedAt?: string
}

export interface CreateSkillPayload {
  name: string
  color: SkillColor
}

export interface UpdateSkillPayload {
  name: string
  color: SkillColor
}
