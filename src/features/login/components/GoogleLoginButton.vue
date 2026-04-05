<script setup>

  import { onMounted } from "vue";
  import { useAuth } from '@/composables/useAuth'
  import { useRouter } from 'vue-router'

  const { loginWithGoogle } = useAuth()
  const router = useRouter()

  function init() {
    globalThis.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });
    globalThis.google.accounts.id.renderButton(
      document.querySelector(".g_id_signin"),
      { 
        theme: "outline", 
        size: "large",
        width: 560,
        locale: 'pt-BR'
      }
    );
  }

  async function handleCredentialResponse(response) {
    try {
      await loginWithGoogle(response.credential)

      await router.replace({ name: 'Home' })
    } catch (err) {
      console.error('Login failed', err)
    }
  }

onMounted(() => {
  init()
})
</script>

<template>
    <div class="g_id_signin"></div>
</template>