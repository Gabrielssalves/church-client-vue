<script setup lang="ts">
// Intentionally empty — BaseCard is a pure slot-wrapper with no props.
// The script block is required for lang="ts" processing.
</script>

<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: var(--color-white);
  border-radius: 10px;
  border: 1px solid var(--border-color, #f1f1f1);
  padding: 16px;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.05));
}
</style>
