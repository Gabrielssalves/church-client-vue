<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="sidebar" :class="{ collapsed: props.collapsed }">
    <SidebarHeader :collapsed="props.collapsed" @toggle="emit('toggle')" />
    <SidebarList :visibleRoutes="visibleRoutes" :collapsed="props.collapsed" :openMenus="openMenus" @toggle="toggle" />
    <SidebarFooter :collapsed="props.collapsed" @logout="handleLogout" />

  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import type { RouteRecordRaw } from 'vue-router'
import SidebarHeader from './SidebarHeader.vue'
import SidebarList from './SidebarList.vue'
import SidebarFooter from './SidebarFooter.vue'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle'): void
}>()

const router = useRouter()
const authStore = useAuthStore()
const openMenus = ref<string[]>([])

const visibleRoutes = computed(() =>
  router.options.routes.filter(route => {
    if (!route.meta?.label || route.meta?.showInSidebar === false) return false
    if (route.meta?.requiresAdmin && !authStore.isAdmin) return false
    return true
  }) as RouteRecordRaw[]
)

function toggle(path: string) {
  openMenus.value = openMenus.value.includes(path)
    ? openMenus.value.filter(p => p !== path)
    : [...openMenus.value, path]
}

function handleLogout() {
  authStore.clearSession()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 258px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: 6px;
  background: var(--color-white);
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  overflow: hidden;
  transition: width 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.sidebar.collapsed {
  width: 75px;
}

@media (max-width: 920px) {
  .sidebar {
    position: relative;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(20, 167, 74, 0.12);
    min-height: auto;
  }

  .sidebar-link,
  .sidebar-toggle {
    justify-content: space-between;
  }
}
</style>