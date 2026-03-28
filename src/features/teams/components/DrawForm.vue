<script setup lang="ts">
import type { PropType } from 'vue'
import type { Group } from '../composables/useDraw'

const props = defineProps({
  endpoint: String,
  namesInput: String,
  groupsList: { type: Array as PropType<Group[]>, required: true }
})

const emit = defineEmits<{
  (event: 'update:endpoint', value: string): void
  (event: 'update:namesInput', value: string): void
  (event: 'update:group', payload: { index: number; field: 'name' | 'color'; value: string }): void
  (event: 'add-group'): void
  (event: 'remove-group', index: number): void
  (event: 'submit'): void
}>()

const handleSubmit = () => emit('submit')
const updateEndpoint = (event: Event) => {
  const value = (event.target as HTMLInputElement)?.value
  emit('update:endpoint', value)
}
const updateNamesInput = (event: Event) => {
  const value = (event.target as HTMLTextAreaElement)?.value
  emit('update:namesInput', value)
}
const updateGroupName = (index: number, value: string) => {
  emit('update:group', { index, field: 'name', value })
}
const updateGroupColor = (index: number, value: string) => {
  emit('update:group', { index, field: 'color', value })
}
</script>

<template>
  <main class="draw-form-card">
    <div class="form-section">
      <label class="label">Endpoint da API (Opcional)</label>
      <input
        type="text"
        class="input-field"
        :value="endpoint"
        @input="updateEndpoint"
        placeholder="https://sua-api.com/sorteio"
      />
    </div>

    <div class="form-section">
      <label class="label">Participantes</label>
      <textarea
        class="textarea-field"
        rows="4"
        :value="namesInput"
        @input="updateNamesInput"
        placeholder="Separe os nomes por vírgula ou nova linha..."
      />
    </div>

    <div class="form-section">
      <label class="label">Configuração de Grupos</label>

      <div
        v-for="(group, index) in groupsList"
        :key="index"
        class="group-row"
      >
        <div class="color-picker-wrapper" :style="{ borderColor: group.color }">
          <input
            type="color"
            class="color-input"
            :value="group.color"
            @input="event => updateGroupColor(index, (event.target as HTMLInputElement).value)"
          />
        </div>

        <input
          type="text"
          class="input-field flex-1"
          :value="group.name"
          @input="event => updateGroupName(index, (event.target as HTMLInputElement).value)"
          placeholder="Nome do Grupo"
        />

        <button
          type="button"
          class="btn-remove"
          @click="() => emit('remove-group', index)"
          v-if="groupsList.length > 1"
        >
          Excluir
        </button>
      </div>

      <button type="button" class="btn-add-group" @click="() => emit('add-group')">
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
}

.btn-primary {
  width: 100%;
  padding: 18px;
  background: #14A74A;
  border: none;
  color: white;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-primary:hover {
  background: #0E7A36;
}
</style>
