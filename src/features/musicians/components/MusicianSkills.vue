<template>
  <div class="skills">
    <BaseBadge
      v-for="skill in skills"
      :key="skill.id"
      :color="skill.color"
    >
      {{ skill.name }}
    </BaseBadge>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from '@/components/BaseBadge.vue'
import type { Skill } from '@/features/musicians/types/Musician'

defineProps<{
  skills: Skill[]
}>()
</script>

<style scoped>
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
</style>