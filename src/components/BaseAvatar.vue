<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  /** Optional explicit alt text; defaults to the full name. */
  alt?: string
}

const props = defineProps<Props>()

const initials = computed(() =>
  props.name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
)
</script>

<template>
  <div class="avatar" :aria-label="alt ?? name" role="img">
    {{ initials }}
  </div>
</template>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-bg-contrast, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text, #374151);
  flex-shrink: 0;
  user-select: none;
}
</style>
