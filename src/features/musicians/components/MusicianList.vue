<template>
  <div class="grid">
    <MusicianCard
      v-for="musician in musicians"
      :key="musician.id"
      :musician="musician"
    />
  </div>
</template>

<script setup lang="ts">
import MusicianCard from './MusicianCard.vue'
import type { Musician } from '@/features/musicians/types/Musician'

defineProps<{
  musicians: Musician[]
}>()
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 920px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
