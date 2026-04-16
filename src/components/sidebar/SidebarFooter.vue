<template>
    <div class="sidebar-footer">
        <button
            type="button"
            class="sidebar-logout"
            aria-label="Sair"
            :title="collapsed ? 'Sair' : undefined"
            @click="emit('logout')"
        >
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
    padding: 10px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.sidebar-logout {
    width: calc(100% - 34px);
    margin: 0 17px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    padding: 4px 8px;
    background: transparent;
    border: none;
    border-radius: 5px;
    color: var(--color-text);
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.sidebar-logout:hover {
    background: rgba(148, 163, 184, 0.2);
}

:global(.sidebar.collapsed) .sidebar-logout {
    justify-content: center;
    width: 90%;
    margin: 2px 3px;
    gap: 0;
    padding: 2px 3px;
}

.sidebar-icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.sidebar-label {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    font-size: 1rem;
    font-weight: 600;
    margin-left: 4px;
}
</style>
