<script setup lang="ts">
// Stateless presentation component — no props required.
</script>

<template>
  <main class="draw-loading" aria-live="polite" aria-label="Processando sorteio">
    <div class="spinner-container" aria-hidden="true">
      <div class="spinner"></div>
    </div>
    <h2>Definindo destinos...</h2>
    <p>A sorte está sendo lançada.</p>
  </main>
</template>

<style scoped>
.draw-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  min-height: 420px;
  color: #2D3748;
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 28px;
}

.spinner {
  position: absolute;
  inset: 0;
  border: 8px solid #F2F6F3;
  border-top-color: #14A74A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px;
}

p {
  color: #4A5568;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
