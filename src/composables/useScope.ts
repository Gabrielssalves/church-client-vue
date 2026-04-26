import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useScope(resource: string) {
  const authStore = useAuthStore()

  const scopes = computed(() => authStore.user?.claims ?? [])

  const canRead = computed(() =>
    authStore.isAdmin ||
    scopes.value.some(
      c => c === `${resource}:read` || c === `${resource}:write` || c === `${resource}:delete`,
    ),
  )

  const canWrite = computed(() => authStore.isAdmin || scopes.value.includes(`${resource}:write`))

  const canDelete = computed(() => authStore.isAdmin || scopes.value.includes(`${resource}:delete`))

  return { canRead, canWrite, canDelete }
}
