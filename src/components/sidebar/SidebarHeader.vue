<template>
    <div class="sidebar-header">
        <div class="sidebar-brand-stage" :class="{ collapsed: props.collapsed }" aria-hidden="true">
            <img :src="fullLogo" alt="" class="sidebar-brand full" :class="{ hidden: props.collapsed }" />
            <img :src="shortLogo" alt="" class="sidebar-brand short" :class="{ visible: props.collapsed }" />
        </div>
        <button type="button" class="sidebar-collapse" @click="emit('toggle')" aria-label="Toggle sidebar">
            <AppIcon :name="props.collapsed ? 'chevron-right' : 'chevron-left'" :size="14" />
        </button>
    </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import fullLogo from '@/assets/logo_vazado800X220.png'
import shortLogo from '@/assets/logo_vazado_abreviado_204X220.png'

const props = defineProps<{ collapsed: boolean }>()

const emit = defineEmits<{
    (event: 'toggle'): void
}>()
</script>

<style scoped>
.sidebar-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 6px 8px;
    border: none;
    border-bottom: 2px solid rgba(148, 163, 184, 0.16);
}

.sidebar-brand-stage {
    position: relative;
    width: 140px;
    height: 38px;
    transition: width 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.sidebar-brand-stage.collapsed {
    width: 38px;
}

.sidebar-brand {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    transform-origin: center;
    transition: opacity 180ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.sidebar-brand.full {
    opacity: 1;
    transform: scale(1);
}

.sidebar-brand.full.hidden {
    opacity: 0;
    transform: scale(0.98);
}

.sidebar-brand.short {
    opacity: 0;
    transform: scale(0.96);
}

.sidebar-brand.short.visible {
    opacity: 1;
    transform: scale(1);
}

.sidebar-collapse {
    position: absolute;
    right: 6px;
    bottom: 4px;
    width: 22px;
    height: 22px;
    border: 1px solid rgba(20, 167, 74, 0.15);
    background: var(--color-white);
    border-radius: 6px;
    color: var(--color-text);
    display: grid;
    place-items: center;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 2;
}

.sidebar-header:hover .sidebar-collapse {
    opacity: 1;
    pointer-events: auto;
}

@media (hover: none) {
    .sidebar-collapse {
        opacity: 1;
        pointer-events: auto;
    }
}
</style>