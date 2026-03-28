<script setup lang="ts">
import type { PropType } from 'vue'
import type { Team, DrawStatus } from '../composables/useDraw'
import TeamCard from './TeamCard.vue'

const props = defineProps({
  teams: { type: Array as PropType<Team[]>, required: true },
  status: { type: String as PropType<DrawStatus>, required: true },
  currentPresentingIndex: { type: Number, required: true },
  animationDuration: { type: Number, required: true }
})

const emit = defineEmits<{
  (event: 'reset'): void
}>()
</script>

<template>
  <section class="results-state">
    <button v-if="status === 'done'" class="btn-back" @click="emit('reset')">
      ← Reiniciar Sorteio
    </button>

    <div class="teams-grid">
      <TeamCard
        v-for="(team, index) in teams"
        :key="index"
        :team="team"
        :status="status"
        :current-index="index"
        :current-presenting-index="currentPresentingIndex"
        :animation-duration="animationDuration"
      />
    </div>
  </section>
</template>

<style scoped>
.results-state {
  position: relative;
}

.btn-back {
  background: transparent;
  border: none;
  color: #4A5568;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 24px;
}

.btn-back:hover {
  color: #14A74A;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
</style>
