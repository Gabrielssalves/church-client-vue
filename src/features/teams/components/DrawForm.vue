<script setup lang="ts">
import type { Group } from '../composables/useDraw'

defineProps<{
  endpoint?: string
  namesInput?: string
  groupsList: Group[]
}>()

const emit = defineEmits<{
  (event: 'update:endpoint', value: string): void
  (event: 'update:namesInput', value: string): void
  (event: 'update:group', payload: { index: number; field: 'name' | 'color'; value: string }): void
  (event: 'add-group'): void
  (event: 'remove-group', index: number): void
  (event: 'submit'): void
}>()

function handleSubmit(): void {
  emit('submit')
}

function updateEndpoint(event: Event): void {
  emit('update:endpoint', (event.target as HTMLInputElement).value)
}

function updateNamesInput(event: Event): void {
  emit('update:namesInput', (event.target as HTMLTextAreaElement).value)
}

function updateGroupName(index: number, event: Event): void {
  emit('update:group', { index, field: 'name', value: (event.target as HTMLInputElement).value })
}

function updateGroupColor(index: number, event: Event): void {
  emit('update:group', { index, field: 'color', value: (event.target as HTMLInputElement).value })
}
</script>

<template>
  <main class="draw-form-card">
    <div class="form-section">
      <label class="label" for="draw-endpoint">Endpoint da API (Opcional)</label>
      <input
        id="draw-endpoint"
        type="text"
        class="input-field"
        :value="endpoint"
        @input="updateEndpoint"
        placeholder="https://sua-api.com/sorteio"
        autocomplete="off"
      />
    </div>

    <div class="form-section">
      <label class="label" for="draw-participants">Participantes</label>
      <textarea
        id="draw-participants"
        class="textarea-field"
        rows="4"
        :value="namesInput"
        @input="updateNamesInput"
        placeholder="Separe os nomes por vírgula ou nova linha..."
      />
    </div>

    <div class="form-section">
      <p class="label" id="groups-label">Configuração de Grupos</p>

      <div
        v-for="(group, index) in groupsList"
        :key="index"
        class="group-row"
        role="group"
        :aria-label="`Grupo ${index + 1}`"
      >
        <div class="color-picker-wrapper" :style="{ borderColor: group.color }">
          <label :for="`group-color-${index}`" class="visually-hidden">
            Cor do grupo {{ index + 1 }}
          </label>
          <input
            :id="`group-color-${index}`"
            type="color"
            class="color-input"
            :value="group.color"
            @input="(event) => updateGroupColor(index, event)"
          />
        </div>

        <label :for="`group-name-${index}`" class="visually-hidden">
          Nome do grupo {{ index + 1 }}
        </label>
        <input
          :id="`group-name-${index}`"
          type="text"
          class="input-field flex-1"
          :value="group.name"
          @input="(event) => updateGroupName(index, event)"
          placeholder="Nome do Grupo"
        />

        <button
          v-if="groupsList.length > 1"
          type="button"
          class="btn-remove"
          :aria-label="`Remover grupo ${index + 1}`"
          @click="emit('remove-group', index)"
        >
          Excluir
        </button>
      </div>

      <button type="button" class="btn-add-group" @click="emit('add-group')">
        + Adicionar novo grupo
      </button>
    </div>

    <div class="actions">
      <button type="button" class="btn-primary" @click="handleSubmit">
        SORTEAR TIMES
      </button>
    </div>
  </main>
</template>

<style scoped>
.draw-form-card {
  max-width: 640px;
  margin: 0 auto;
  padding: 36px;
  border-radius: 32px;
  background: white;
  border: 1px solid #E2E8F0;
  box-shadow: 0 16px 40px rgba(45, 55, 72, 0.08);
}

.form-section {
  margin-bottom: 28px;
}

.label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #718096;
  margin-bottom: 12px;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 16px 18px;
  border-radius: 8px;
  border: 1px solid var(--color-primary);
  color: #2D3748;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.input-field:focus,
.textarea-field:focus {
  outline: none;
  border-color: #14A74A;
  background: white;
  box-shadow: 0 0 0 4px rgba(20, 167, 74, 0.1);
}

.textarea-field {
  resize: none;
}

.group-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.flex-1 {
  flex: 1;
}

.color-picker-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  overflow: hidden;
  border: 2px solid #E2E8F0;
  flex-shrink: 0;
}

.color-input {
  width: 100px;
  height: 100px;
  position: relative;
  top: -22px;
  left: -22px;
  border: none;
  cursor: pointer;
}

.btn-remove {
  background: #FEF2F2;
  color: #EF4444;
  border: none;
  padding: 14px 18px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  font-family: inherit;
}

.btn-remove:hover {
  background: #FEE2E2;
}

.btn-add-group {
  width: 100%;
  padding: 14px;
  background: transparent;
  border: 2px dashed #E2E8F0;
  border-radius: 18px;
  color: #4A5568;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary {
  width: 100%;
  padding: 18px;
  background: var(--color-primary);
  border: none;
  color: white;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

/* Accessible visually-hidden utility */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
