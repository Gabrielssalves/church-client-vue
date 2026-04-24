import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useFeatureClaim(claim: string) {
  const authStore = useAuthStore()

  const hasClaim = computed(() => {
    const claims = authStore.user?.claims
    return Array.isArray(claims) && claims.includes(claim)
  })

  return { hasClaim }
}
