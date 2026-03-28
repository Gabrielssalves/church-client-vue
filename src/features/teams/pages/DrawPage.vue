<script setup lang="ts">
import DrawForm from '../components/DrawForm.vue'
import DrawLoading from '../components/DrawLoading.vue'
import DrawResults from '../components/DrawResults.vue'
import ErrorBanner from '../components/ErrorBanner.vue'
import { useDraw } from '../composables/useDraw'

const {
  status,
  errorMessage,
  endpoint,
  namesInput,
  groupsList,
  teams,
  currentPresentingIndex,
  animationDuration,
  clearErrorMessage,
  adicionarGrupo,
  removerGrupo,
  updateGroup,
  realizarSorteio,
  resetar
} = useDraw()
</script>

<template>
  <div class="teams-page">
    <header class="teams-header">
      <h1 class="teams-title">Sorteio de Times</h1>
    </header>

    <ErrorBanner
      v-if="errorMessage"
      :message="errorMessage"
      @close="clearErrorMessage"
    />

    <DrawForm
      v-if="status === 'idle'"
      v-model:endpoint="endpoint"
      v-model:namesInput="namesInput"
      :groups-list="groupsList"
      @update:group="payload => updateGroup(payload.index, payload.field, payload.value)"
      @add-group="adicionarGrupo"
      @remove-group="removerGrupo"
      @submit="realizarSorteio"
    />

    <DrawLoading v-else-if="status === 'loading'" />

    <DrawResults
      v-else
      :teams="teams"
      :status="status"
      :current-presenting-index="currentPresentingIndex"
      :animation-duration="animationDuration"
      @reset="resetar"
    />
  </div>
</template>

<style scoped>
.teams-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  color: #2d3748;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.teams-header {
  text-align: center;
  margin-bottom: 40px;
}

.teams-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 14px;
  letter-spacing: -0.03em;
  color: #14a74a;
}

.teams-divider {
  width: 96px;
  height: 6px;
  background: linear-gradient(90deg, #14a74a 0%, #1473a7 100%);
  margin: 0 auto;
  border-radius: 999px;
}

@media (max-width: 768px) {
  .teams-page {
    padding: 24px 16px 60px;
  }

  .teams-title {
    font-size: 2.4rem;
  }
}
</style>