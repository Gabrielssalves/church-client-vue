<template>
  <BaseCard class="musician-card">
    <div class="header">
      <BaseAvatar :name="musician.name" />
      <div class="info">
        <h3>{{ musician.name }}</h3>
        <small v-if="musician.email">{{ musician.email }}</small>
      </div>
    </div>

    <MusicianSkills :skills="musician.skills" />
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
import BaseAvatar from '@/components/BaseAvatar.vue'
import MusicianSkills from './MusicianSkills.vue'
import type { Musician } from '@/features/musicians/types/Musician'

defineProps<{
  musician: Musician
}>()
</script>

<style scoped>
.musician-card {
  padding: 22px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info h3 {
  margin: 0;
  font-size: 1.05rem;
}

.info small {
  display: block;
  margin-top: 6px;
  color: #6b7280;
}
</style>