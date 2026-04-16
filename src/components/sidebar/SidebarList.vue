<template>
    <ul class="sidebar-list" :class="{ 'is-collapsed': props.collapsed }">
        <li v-for="route in visibleRoutes" :key="route.path" class="sidebar-item">
            <template v-if="!route.children || route.children.length === 0">
                <RouterLink :to="route.path" class="sidebar-link" active-class="sidebar-link--active"
                    :title="props.collapsed ? String(route.meta?.label ?? '') : undefined"
                    :aria-label="props.collapsed ? String(route.meta?.label ?? '') : undefined">
                    <span class="sidebar-icon">
                        <AppIcon :name="getIcon(route)" :size="18" />
                    </span>
                    <span v-if="!props.collapsed" class="sidebar-label">{{ route.meta?.label }}</span>
                </RouterLink>
            </template>

            <template v-else>
                <button type="button" class="sidebar-toggle" @click="toggle(route.path)"
                    :title="props.collapsed ? String(route.meta?.label ?? '') : undefined"
                    :aria-label="props.collapsed ? String(route.meta?.label ?? '') : undefined">
                    <span class="sidebar-icon">
                        <AppIcon :name="getIcon(route)" :size="18" />
                    </span>
                    <span v-if="!props.collapsed" class="sidebar-label">{{ route.meta?.label }}</span>
                    <span v-if="!props.collapsed" class="chevron" :class="{ open: openMenus.includes(route.path) }">
                        <AppIcon name="chevron-down" :size="16" />
                    </span>
                </button>

                <Transition name="submenu-fade">
                    <ul v-if="!props.collapsed && openMenus.includes(route.path)" class="sidebar-sublist">
                        <li v-for="child in route.children" :key="child.path" class="sidebar-subitem">
                            <RouterLink :to="getChildPath(route.path, child.path)"
                                class="sidebar-link sidebar-link--child" active-class="sidebar-link--active">
                                <span class="sidebar-icon">
                                    <AppIcon :name="getIcon(child)" :size="16" />
                                </span>
                                <span v-if="!props.collapsed" class="sidebar-label">{{ child.meta?.label }}</span>
                            </RouterLink>
                        </li>
                    </ul>
                </Transition>
            </template>
        </li>
    </ul>
    <p v-if="visibleRoutes.length === 0 && !props.collapsed" class="sidebar-empty">
        Nenhuma rota disponível
    </p>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps<{
    visibleRoutes: RouteRecordRaw[]
    collapsed: boolean
    openMenus: string[]
}>()

const emit = defineEmits<{
    (event: 'toggle', path: string): void
}>()

function toggle(path: string) {
    emit('toggle', path)
}

function getIcon(route: RouteRecordRaw) {
    if (route.meta?.icon) {
        return String(route.meta.icon)
    }

    return 'circle'
}

function getChildPath(parentPath: string, childPath: string) {
    if (childPath.startsWith('/')) {
        return childPath
    }
    return `${parentPath}/${childPath}`
}
</script>

<style scoped>
.sidebar-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 0;
    padding: 10px 0;
}

.sidebar-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 4px;
}

.sidebar-link,
.sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: calc(100% - 34px);
    margin: 0 17px;
    border-radius: 5px;
    color: var(--color-text);
    background: transparent;
    border: 0;
    font-family: inherit;
    font-size: 0.95rem;
    padding: 4px 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.sidebar-link:not(.sidebar-link--active):hover,
.sidebar-toggle:hover {
    background: rgba(148, 163, 184, 0.2);
    cursor: pointer;
}

.sidebar-link--active {
    background: var(--color-primary);
    color: var(--color-white);
    box-shadow: inset 0 0 0 1px rgba(20, 167, 74, 0.3);
}

.sidebar-icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 5px;
    flex-shrink: 0;
    font-size: 0.95rem;
}

.sidebar-label {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    font-size: 1rem;
    font-weight: 600;
    margin-left: 4px;
}

.sidebar-list.is-collapsed .sidebar-link,
.sidebar-list.is-collapsed .sidebar-toggle {
    width: 90%;
    margin: 2px 3px;
    padding: 2px 3px;
    justify-content: center;
}

.sidebar-list.is-collapsed .sidebar-item {
    margin-bottom: 0;
}

.sidebar-list.is-collapsed .sidebar-link .sidebar-icon,
.sidebar-list.is-collapsed .sidebar-toggle .sidebar-icon {
    margin-right: 0;
}

.sidebar-list.is-collapsed .sidebar-label {
    margin-left: 0;
}

.chevron {
    margin-left: auto;
    opacity: 0;
    pointer-events: none;
    transition: opacity 120ms ease, transform 0.2s ease;
}

.chevron.open {
    transform: rotate(180deg);
}

.sidebar-toggle:hover .chevron,
.sidebar-toggle:focus-visible .chevron {
    opacity: 1;
}

.sidebar-sublist {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin: 0;
    font-size: 0.86rem;
    font-weight: 400;
}

.submenu-fade-enter-active,
.submenu-fade-leave-active {
    transition: opacity 150ms ease, transform 150ms ease;
}

.submenu-fade-enter-from,
.submenu-fade-leave-to {
    opacity: 0;
    transform: translateY(-3px);
}

.sidebar-link--child {
    font-size: 0.86rem;
    font-weight: 400;
    padding-left: 16px;
}

.sidebar-link--child .sidebar-label {
    font-size: 0.86rem;
    font-weight: 400;
}

.sidebar-link--child.sidebar-link--active {
    background: var(--color-primary-dark);
    color: var(--color-white);
}

.sidebar-empty {
    margin-top: auto;
    color: var(--color-text-light);
    font-size: 0.95rem;
    text-align: center;
}


@media (max-width: 920px) {

    .sidebar-link,
    .sidebar-toggle {
        justify-content: space-between;
    }
}
</style>