<script setup lang="ts">
import type { BadgeColor } from '@/types/ui'

interface Props {
  color?: BadgeColor
}

withDefaults(defineProps<Props>(), {
  color: 'gray',
})
</script>

<template>
  <span :class="['badge', `badge--${color}`]">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.badge--green {
  background: var(--badge-green-bg);
  color: var(--badge-green-color);
}

.badge--teal {
  background: var(--badge-teal-bg);
  color: var(--badge-teal-color);
}

.badge--blue {
  background: var(--badge-blue-bg);
  color: var(--badge-blue-color);
}

.badge--indigo {
  background: var(--badge-indigo-bg);
  color: var(--badge-indigo-color);
}

.badge--purple {
  background: var(--badge-purple-bg);
  color: var(--badge-purple-color);
}

.badge--pink {
  background: var(--badge-pink-bg);
  color: var(--badge-pink-color);
}

.badge--red {
  background: var(--badge-red-bg);
  color: var(--badge-red-color);
}

.badge--orange {
  background: var(--badge-orange-bg);
  color: var(--badge-orange-color);
}

.badge--yellow {
  background: var(--badge-yellow-bg);
  color: var(--badge-yellow-color);
}

.badge--lime {
  background: var(--badge-lime-bg);
  color: var(--badge-lime-color);
}

.badge--cyan {
  background: var(--badge-cyan-bg);
  color: var(--badge-cyan-color);
}

.badge--gray {
  background: var(--badge-gray-bg);
  color: var(--badge-gray-color);
}
</style>
