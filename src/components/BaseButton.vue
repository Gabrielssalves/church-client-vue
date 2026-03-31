<template>
  <button :class="['btn', variantClass, sizeClass]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: Boolean
})

const variantClass = computed(() => `btn--${props.variant}`)
const sizeClass = computed(() => `btn--${props.size}`)
</script>

<style scoped>
.btn {
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.btn--primary {
  background: #4f46e5;
  color: white;
}

.btn--secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn--ghost {
  background: transparent;
  color: #374151;
}

/* Sizes */
.btn--sm {
  padding: 6px 10px;
  font-size: 12px;
}

.btn--md {
  padding: 8px 14px;
  font-size: 14px;
}

.btn--lg {
  padding: 10px 18px;
  font-size: 16px;
}
</style>