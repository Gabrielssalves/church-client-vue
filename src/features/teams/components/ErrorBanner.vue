<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<template>
  <div class="error-banner" role="alert" aria-live="assertive">
    <p class="error-banner__message">{{ message }}</p>
    <button
      type="button"
      class="close-button"
      aria-label="Fechar mensagem de erro"
      @click="emit('close')"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<style scoped>
.error-banner {
  max-width: 680px;
  margin: 0 auto 24px;
  padding: 18px 22px;
  border-radius: 22px;
  background: #FEF2F2;
  border: 1px solid #FEE2E2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #B91C1C;
}

.error-banner__message {
  margin: 0;
  flex: 1;
}

.close-button {
  background: transparent;
  border: none;
  color: #B91C1C;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
  flex-shrink: 0;
}

.close-button:hover {
  opacity: 0.7;
}
</style>
