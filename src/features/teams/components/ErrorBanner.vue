<script setup lang="ts">
const props = defineProps({
  message: { type: String, required: true }
})

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>

<template>
  <div class="error-banner">
    <p>{{ message }}</p>
    <button type="button" class="close-button" @click="emit('close')">×</button>
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
  color: #B91C1C;
}

.close-button {
  background: transparent;
  border: none;
  color: #B91C1C;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}
</style>
