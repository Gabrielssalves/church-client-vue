<template>
  <div id="app">
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
      &copy; 2026 MeuSite. Todos os direitos reservados.
    </footer>
  </div>
</template>

<script setup>
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}

.app-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
  padding: 2rem;
}

.app-footer {
  background-color: #f4f4f4;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
}
</style>