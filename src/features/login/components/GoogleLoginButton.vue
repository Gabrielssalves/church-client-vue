<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { env } from '@/config/env'

// ---------------------------------------------------------------------------
// Minimal type shim for the Google Identity Services SDK.
// The full @types/google.accounts package can be added later if needed.
// ---------------------------------------------------------------------------

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string
      callback: (response: GoogleCredentialResponse) => void
    }) => void
    renderButton: (
      parent: Element,
      options: {
        theme?: string
        size?: string
        width?: number
        locale?: string
      }
    ) => void
  }
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts }
  }
}

const { t } = useI18n()
const { loginWithGoogle } = useAuth()
const router = useRouter()
const initError = ref<string | null>(null)

function init(): void {
  if (!window.google?.accounts) {
    initError.value = t('login.google_sdk_error')
    return
  }

  const buttonEl = document.querySelector<Element>('.g_id_signin')
  if (!buttonEl) return

  window.google.accounts.id.initialize({
    client_id: env.googleClientId,
    callback: handleCredentialResponse,
  })

  window.google.accounts.id.renderButton(buttonEl, {
    theme: 'outline',
    size: 'large',
    width: 560,
    locale: 'pt-BR',
  })
}

async function handleCredentialResponse(response: GoogleCredentialResponse): Promise<void> {
  try {
    await loginWithGoogle(response.credential)
    await router.replace({ name: 'Dashboard' })
  } catch (err) {
    // Error state is held by the store and exposed through useAuth in LoginForm
    console.error('[GoogleLoginButton] login failed', err)
  }
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <p v-if="initError" role="alert" class="sdk-error">{{ initError }}</p>
    <div class="g_id_signin" :aria-label="t('login.google')"></div>
  </div>
</template>

<style scoped>
.sdk-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0 0 0.5rem;
}
</style>
