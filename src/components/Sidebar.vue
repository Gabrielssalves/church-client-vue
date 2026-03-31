<template>
  <nav class="sidebar" :class="{ collapsed: props.collapsed }">
    <div class="sidebar-header">
      <span class="sidebar-brand">Menu</span>
      <button type="button" class="sidebar-collapse" @click="emit('toggle')" aria-label="Toggle sidebar">
        <span>{{ props.collapsed ? '›' : '‹' }}</span>
      </button>
    </div>

    <ul class="sidebar-list">
      <li v-for="route in visibleRoutes" :key="route.path" class="sidebar-item">
        <template v-if="!route.children || route.children.length === 0">
          <RouterLink
            :to="route.path"
            class="sidebar-link"
            active-class="sidebar-link--active"
          >
            <span class="sidebar-icon">{{ getIcon(route) }}</span>
            <span class="sidebar-label">{{ route.meta?.label }}</span>
          </RouterLink>
        </template>

        <template v-else>
          <button
            type="button"
            class="sidebar-toggle"
            @click="toggle(route.path)"
          >
            <span class="sidebar-icon">{{ getIcon(route) }}</span>
            <span class="sidebar-label">{{ route.meta?.label }}</span>
            <span class="chevron" :class="{ open: openMenus.includes(route.path) }">▾</span>
          </button>

          <ul v-if="!props.collapsed && openMenus.includes(route.path)" class="sidebar-sublist">
            <li v-for="child in route.children" :key="child.path" class="sidebar-subitem">
              <RouterLink
                :to="`${route.path}/${child.path}`"
                class="sidebar-link sidebar-link--child"
                active-class="sidebar-link--active"
              >
                <span class="sidebar-icon">{{ getIcon(child) }}</span>
                <span class="sidebar-label">{{ child.meta?.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </template>
      </li>
    </ul>

        <p v-if="visibleRoutes.length === 0" class="sidebar-empty">
      Nenhuma rota disponível
    </p>

    <div class="sidebar-footer">
      <button type="button" class="sidebar-logout" @click="handleLogout">
        <span class="sidebar-icon">⏻</span>
        <span class="sidebar-label">Sair</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  collapsed: Boolean
})

const emit = defineEmits<{
  (event: 'toggle'): void
}>()

const router = useRouter()
const authStore = useAuthStore()
const openMenus = ref<string[]>([])

const visibleRoutes = computed(() =>
  router.options.routes.filter(route => route.meta?.label && route.meta?.showInSidebar !== false)
)

function toggle(path: string) {
  openMenus.value = openMenus.value.includes(path)
    ? openMenus.value.filter(p => p !== path)
    : [...openMenus.value, path]
}

function getIcon(route: any) {
  if (route.meta?.icon) {
    return route.meta.icon
  }

  return route.meta?.label?.charAt(0).toUpperCase() || '•'
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
  width: 260px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 18px;
  background: #ffffff;
  border-right: 1px solid rgba(20, 167, 74, 0.12);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary-dark);
}

.sidebar-collapse {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(20, 167, 74, 0.15);
  background: transparent;
  border-radius: 8px;
  color: var(--color-text);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.sidebar.collapsed .sidebar-brand,
.sidebar.collapsed .chevron,
.sidebar.collapsed .sidebar-link .sidebar-label,
.sidebar.collapsed .sidebar-toggle .sidebar-label,
.sidebar.collapsed .sidebar-link--child .sidebar-label {
  display: none;
}

.sidebar-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.sidebar-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-link,
.sidebar-toggle {
  display: flex;
  align-items: center;
  width: 100%;
  color: var(--color-text);
  background: transparent;
  border: 0;
  padding: 12px 14px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.sidebar-link {
  justify-content: flex-start;
}

.sidebar.collapsed .sidebar-link,
.sidebar.collapsed .sidebar-toggle {
  justify-content: center;
  padding: 12px;
}

.sidebar-link:hover,
.sidebar-toggle:hover {
  background: rgba(20, 167, 74, 0.08);
  cursor: pointer;
}

.sidebar-link--active {
  background: rgba(20, 167, 74, 0.18);
  color: var(--color-primary-dark);
}

.sidebar-icon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(20, 167, 74, 0.08);
  margin-right: 12px;
  font-size: 0.95rem;
}

.sidebar.collapsed .sidebar-icon {
  margin-right: 0;
}

.sidebar-toggle {
  justify-content: space-between;
}

.chevron {
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.sidebar-sublist {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 16px;
}

.sidebar-link--child {
  font-size: 0.95rem;
  font-weight: 500;
  padding-left: 18px;
}

.sidebar-empty {
  margin-top: auto;
  color: var(--color-text-light);
  font-size: 0.95rem;
  text-align: center;
}

.sidebar-footer {
  margin-top: auto;
}

.sidebar-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(239, 246, 255, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 16px;
  color: #111827;
  font-weight: 600;
  cursor: pointer;
}

.sidebar-logout:hover {
  background: rgba(248, 250, 252, 0.98);
}

.sidebar.collapsed .sidebar-logout {
  justify-content: center;
}

.sidebar.collapsed .sidebar-logout .sidebar-label {
  display: none;
}

@media (max-width: 920px) {
  .sidebar {
    position: relative;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(20, 167, 74, 0.12);
    min-height: auto;
  }

  .sidebar.collapsed {
    width: 100%;
  }

  .sidebar-link,
  .sidebar-toggle {
    justify-content: space-between;
  }
}
</style>