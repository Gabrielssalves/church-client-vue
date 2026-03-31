<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 10px;
  border: 1px solid #f1f1f1;
  padding: 16px;
  transition: 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>