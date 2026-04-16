<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'

withDefaults(
    defineProps<{
        title?: string
        subtitle?: string
        icon?: string
        clickable?: boolean
    }>(),
    {
        title: '',
        subtitle: '',
        icon: '',
        clickable: false
    }
)
</script>

<template>
    <article class="dashboard-card" :class="{ 'is-clickable': clickable }">
        <header v-if="title || subtitle || icon || $slots.header" class="dashboard-card__header">
            <div class="dashboard-card__heading">
                <h3 v-if="title" class="dashboard-card__title">{{ title }}</h3>
                <p v-if="subtitle" class="dashboard-card__subtitle">{{ subtitle }}</p>
            </div>

            <div class="dashboard-card__header-right">
                <slot name="header" />
                <span v-if="icon" class="dashboard-card__icon" aria-hidden="true">
                    <AppIcon :name="icon" :size="16" />
                </span>
            </div>
        </header>

        <div class="dashboard-card__body">
            <slot />
        </div>
    </article>
</template>

<style scoped>
.dashboard-card {
    background: var(--color-white);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
    padding: 20px;
}

.dashboard-card.is-clickable {
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.dashboard-card.is-clickable:hover {
    border-color: rgba(20, 167, 74, 0.25);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
}

.dashboard-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
}

.dashboard-card__heading {
    min-width: 0;
}

.dashboard-card__title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--color-text);
}

.dashboard-card__subtitle {
    margin: 4px 0 0;
    font-size: 0.92rem;
    color: var(--color-text-light);
}

.dashboard-card__header-right {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.dashboard-card__icon {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: rgba(20, 167, 74, 0.1);
    color: var(--color-primary-dark);
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.dashboard-card__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
