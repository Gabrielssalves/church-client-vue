<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: number
  alt?: string
}

const props = withDefaults(defineProps<Props>(), { size: 40 })

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
  <div
    class="avatar"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.35)}px` }"
    :aria-label="alt ?? name"
    role="img"
  >
    {{ initials }}
  </div>
</template>

<style scoped>
.avatar {
  border-radius: 50%;
  background: var(--color-bg-contrast, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-text, #374151);
  flex-shrink: 0;
  user-select: none;
}
</style>
