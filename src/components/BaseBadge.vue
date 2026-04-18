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

.badge--green   { background: #dcfce7; color: #16a34a; }
.badge--teal    { background: #ccfbf1; color: #0f766e; }
.badge--blue    { background: #dbeafe; color: #2563eb; }
.badge--indigo  { background: #e0e7ff; color: #4338ca; }
.badge--purple  { background: #f3e8ff; color: #9333ea; }
.badge--pink    { background: #fce7f3; color: #db2777; }
.badge--red     { background: #fee2e2; color: #dc2626; }
.badge--orange  { background: #ffedd5; color: #ea580c; }
.badge--yellow  { background: #fef9c3; color: #ca8a04; }
.badge--lime    { background: #ecfccb; color: #65a30d; }
.badge--cyan    { background: #cffafe; color: #0891b2; }
.badge--gray    { background: #f3f4f6; color: #4b5563; }
</style>
