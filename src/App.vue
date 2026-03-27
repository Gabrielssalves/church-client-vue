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
.app-footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
}
</style>