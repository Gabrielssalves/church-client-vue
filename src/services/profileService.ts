import { authHttpClient } from '@/lib/http'
import type { User } from '@/types/auth'

export interface UpdateProfilePayload {
  name?: string
  currentPassword?: string
  newPassword?: string
}

export const profileService = {
  async update(payload: UpdateProfilePayload): Promise<User> {
    const res = await authHttpClient.put<User>('/auth/me', payload)
    return res.data
  },
}
