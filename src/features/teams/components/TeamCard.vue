<script setup lang="ts">
import { computed } from 'vue'
import type { Team, DrawStatus } from '@/features/teams/composables/useDraw'

const props = defineProps<{
  team: Team
  status: DrawStatus
  currentIndex: number
  currentPresentingIndex: number
  animationDuration: number
}>()

const isActive = computed(
  () =>
    props.currentPresentingIndex === props.currentIndex &&
    props.status === 'presenting'
)

const isDone = computed(() => props.status === 'done')

const isPast = computed(
  () => props.currentPresentingIndex > props.currentIndex
)

const cardStyle = computed(() =>
  isActive.value
    ? {
        borderColor: props.team.color,
        boxShadow: `0 20px 50px -12px ${props.team.color}40`,
        transform: 'scale(1.05)',
        zIndex: 20,
      }
    : {}
)

const headerStyle = computed(() => ({
  backgroundColor:
    isActive.value || isDone.value ? `${props.team.color}08` : '#F9FAFB',
}))

const teamTextColor = computed(() =>
  isActive.value || isDone.value ? props.team.color : '#2D3748'
)
</script>

<template>
  <article class="team-card" :style="cardStyle">
    <div class="team-header" :style="headerStyle">
      <h3 class="team-name" :style="{ color: teamTextColor }">
        {{ team.groupName }}
      </h3>
    </div>

    <div class="team-body">
      <div v-if="isActive" class="credits-wrapper">
        <div
          class="credits-animation"
          :style="{ '--duration': animationDuration + 'ms' }"
          aria-live="polite"
        >
          <div
            v-for="(member, memberIndex) in team.members"
            :key="`anim-${memberIndex}`"
            class="credit-item"
            :style="{ color: team.color }"
          >
            {{ member }}
          </div>
        </div>
      </div>

      <div v-else-if="isDone || isPast" class="final-list">
        <div class="member-badges">
          <span
            v-for="(member, memberIndex) in team.members"
            :key="`final-${memberIndex}`"
            class="member-badge"
            :style="{
              backgroundColor: `${team.color}15`,
              borderColor: `${team.color}30`,
              color: team.color,
            }"
          >
            {{ member }}
          </span>
        </div>

        <div v-if="team.members.length === 0" class="empty-state">Vazio</div>
      </div>

      <div v-else class="pending-state" aria-label="Aguardando revelação">
        &#128274;
      </div>
    </div>
  </article>
</template>

<style scoped>
.team-card {
  background: white;
  border-radius: 32px;
  border: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.35s ease;
  min-height: 520px;
}

.team-header {
  padding: 24px;
  border-bottom: 1px solid #E2E8F0;
  text-align: center;
}

.team-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.team-body {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.credits-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.credits-animation {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: scroll var(--duration) linear forwards;
}

.credit-item {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 24px;
}

.final-list {
  padding: 30px;
  height: 100%;
  overflow-y: auto;
}

.final-list::-webkit-scrollbar {
  display: none;
}

.member-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.member-badge {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  border: 1px solid transparent;
}

.empty-state,
.pending-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
}

.pending-state {
  font-size: 3rem;
  opacity: 0.2;
}

@keyframes scroll {
  0% { transform: translateY(260px); }
  100% { transform: translateY(-100%); }
}
</style>
