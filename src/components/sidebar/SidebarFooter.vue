<template>
    <div class="sidebar-footer">
        <button type="button" class="sidebar-logout" @click="emit('logout')" :title="collapsed ? 'Sair' : undefined"
            :aria-label="collapsed ? 'Sair' : undefined">
            <span class="sidebar-icon">
                <AppIcon name="log-out" :size="18" />
            </span>
            <span v-if="!collapsed" class="sidebar-label">Sair</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps<{ collapsed: boolean }>()

const emit = defineEmits<{
    (event: 'logout'): void
}>()
</script>
<style scoped>
.sidebar-footer {
    margin-top: auto;
}

.sidebar-logout {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    padding: 12px 14px;
    background: var(--color-white);
    border: none;
    border-top: 2px solid rgba(148, 163, 184, 0.16);
    color: #111827;
    font-weight: 600;
    cursor: pointer;
}

.sidebar-logout:hover {
    background: rgba(20, 167, 74, 0.08);
}

:global(.sidebar.collapsed) .sidebar-logout {
    justify-content: center;
    gap: 0;
    padding: 12px;
}

.sidebar-icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}
</style>