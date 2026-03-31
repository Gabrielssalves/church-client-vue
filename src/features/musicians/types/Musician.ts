export interface Skill {
  id: string
  name: string
  color: string
}

export interface Musician {
  id: string
  name: string
  email?: string
  skills: Skill[]
}