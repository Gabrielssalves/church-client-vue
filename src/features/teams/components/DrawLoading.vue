<template>
  <main class="draw-loading">
    <div class="spinner-container">
      <div class="spinner"></div>
      <div class="spinner-icon">🎲</div>
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
  width: 130px;
  height: 130px;
  margin-bottom: 28px;
}

.spinner {
  position: absolute;
  inset: 0;
  border: 10px solid #F2F6F3;
  border-top-color: #14A74A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-icon {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 2.5rem;
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
