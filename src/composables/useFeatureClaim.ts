import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useFeatureClaim(claim: string) {
  const authStore = useAuthStore()

  const hasClaim = computed(() => authStore.user?.claims.includes(claim) ?? false)

  return { hasClaim }
}
