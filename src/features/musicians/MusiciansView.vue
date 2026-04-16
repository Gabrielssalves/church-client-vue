<template>
  <section class="musicians-view">
    <div class="header">
      <div class="title-group">
        <h1>Musicians</h1>
        <p>Manage team members, contact details, and their skills.</p>
      </div>

      <BaseButton variant="primary" size="lg" @click="handleAdd">
        + Add Musician
      </BaseButton>
    </div>

    <MusicianList :musicians="musicians" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import MusicianList from '@/features/musicians/components/MusicianList.vue'
import type { Musician } from '@/features/musicians/types/Musician'

const musicians = ref<Musician[]>([
  {
    id: '1',
    name: 'Ariel Vaccari',
    skills: [
      { id: '1', name: 'Guitarra', color: 'red' },
      { id: '2', name: 'Violão', color: 'purple' },
      { id: '3', name: 'Baixo', color: 'blue' },
      { id: '4', name: 'Teclado', color: 'green' }
    ]
  },
  {
    id: '2',
    name: 'Cesar Eduardo',
    skills: [
      { id: '1', name: 'Violão', color: 'purple' },
      { id: '2', name: 'Baixo', color: 'blue' }
    ]
  },
  {
    id: '3',
    name: 'Chris Bosio',
    skills: [
      { id: '1', name: 'Backing', color: 'orange' }
    ]
  },
  {
    id: '4',
    name: 'Gabriel Alves',
    email: 'gabrielsalves97@gmail.com',
    skills: [
      { id: '1', name: 'Bateria', color: 'red' },
      { id: '2', name: 'Guitarra', color: 'orange' }
    ]
  },
  {
    id: '5',
    name: 'Gabrielle Burti',
    skills: [
      { id: '1', name: 'Ministro', color: 'blue' },
      { id: '2', name: 'Backing', color: 'orange' }
    ]
  },
  {
    id: '6',
    name: 'Gustavo Seila',
    skills: [
      { id: '1', name: 'Backing', color: 'orange' },
      { id: '2', name: 'Teclado', color: 'green' }
    ]
  },
  {
    id: '7',
    name: 'Igor Gondin',
    skills: [
      { id: '1', name: 'Bateria', color: 'red' },
      { id: '2', name: 'Guitarra', color: 'orange' },
      { id: '3', name: 'Violão', color: 'purple' }
    ]
  },
  {
    id: '8',
    name: 'Jaylane Seila',
    skills: [
      { id: '1', name: 'Ministro', color: 'blue' },
      { id: '2', name: 'Backing', color: 'orange' }
    ]
  },
  {
    id: '9',
    name: 'Mariana',
    skills: [
      { id: '1', name: 'Ministro', color: 'blue' },
      { id: '2', name: 'Backing', color: 'orange' }
    ]
  },
  {
    id: '10',
    name: 'Murilo Bosio',
    skills: [
      { id: '1', name: 'Ministro', color: 'blue' },
      { id: '2', name: 'Violão', color: 'purple' }
    ]
  },
  {
    id: '11',
    name: 'Nathalia Vaccari',
    skills: [
      { id: '1', name: 'Backing', color: 'orange' }
    ]
  },
  {
    id: '12',
    name: 'Nicole Seila',
    skills: [
      { id: '1', name: 'Backing', color: 'orange' },
      { id: '2', name: 'Teclado', color: 'green' }
    ]
  }
])

function handleAdd(): void {
  // TODO: open "Add Musician" modal — requires modal component and musician store
}
</script>

<style scoped>
.musicians-view {
  max-width: 1060px;
  margin: 0 auto;
  padding: 36px 24px 48px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
}

.title-group {
  max-width: 720px;
}

h1 {
  margin: 0 0 8px;
  font-size: 2rem;
}

p {
  margin: 0;
  color: #6b7280;
  line-height: 1.7;
}
</style>