<template>
  <div class="avatar">
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true }
})

const initials = props.name
  .split(' ')
  .map(n => n[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #374151;
}
</style>