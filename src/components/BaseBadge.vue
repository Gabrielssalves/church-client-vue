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

.badge--red {
  background: #fee2e2;
  color: #dc2626;
}

.badge--blue {
  background: #dbeafe;
  color: #2563eb;
}

.badge--green {
  background: #dcfce7;
  color: #16a34a;
}

.badge--purple {
  background: #f3e8ff;
  color: #9333ea;
}

.badge--orange {
  background: #ffedd5;
  color: #ea580c;
}

.badge--gray {
  background: #f3f4f6;
  color: #4b5563;
}
</style>
