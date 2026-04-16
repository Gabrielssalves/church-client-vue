<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonHTMLAttributes } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: ButtonHTMLAttributes['type']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClass = computed(() => `btn--${props.variant}`)
const sizeClass = computed(() => `btn--${props.size}`)
const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    :class="['btn', variantClass, sizeClass, { 'btn--loading': loading }]"
    :disabled="isDisabled"
    :type="type"
    :aria-disabled="isDisabled"
    :aria-busy="loading"
    @click="(e) => !isDisabled && emit('click', e)"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled,
.btn--loading {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.btn--primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  opacity: 1;
}

.btn--secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn--ghost {
  background: transparent;
  color: var(--color-text);
}

.btn--danger {
  background: #fee2e2;
  color: #dc2626;
}

.btn--danger:hover:not(:disabled) {
  background: #fecaca;
  opacity: 1;
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

/* Loading spinner */
.btn-spinner {
  width: 0.875em;
  height: 0.875em;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: btn-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
</style>
