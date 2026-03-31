<template>
  <div class="layout-shell" :class="{ collapsed: isCollapsed, 'no-sidebar': !showSidebar }">
    <Sidebar v-if="showSidebar" :collapsed="isCollapsed" @toggle="toggleSidebar" />

    <main class="layout-main" :class="{ 'no-padding': !showSidebar }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const isCollapsed = ref(false)
const route = useRoute()

const showSidebar = computed(() => route.meta?.hideSidebar !== true)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  width: 100%;
  background: var(--color-bg);
}

.layout-main {
  margin-left: 260px;
  padding: 28px;
  transition: margin-left 0.25s ease;
}

.layout-shell.collapsed .layout-main {
  margin-left: 80px;
}

.layout-shell.no-sidebar .layout-main {
  margin-left: 0;
}

.layout-main.no-padding {
  padding: 0;
}

@media (max-width: 920px) {
  .layout-main {
    margin-left: 0;
    padding: 20px;
  }
}
</style>