<template>
    <div class="sidebar-footer">
        <button
            type="button"
            class="sidebar-btn"
            :aria-label="t('sidebar.lang')"
            :title="collapsed ? t('sidebar.lang') : undefined"
            @click="toggleLocale"
        >
            <span class="sidebar-icon lang-icon">{{ t('sidebar.lang') }}</span>
            <span v-if="!collapsed" class="sidebar-label">{{ t('sidebar.lang') }}</span>
        </button>

        <button
            type="button"
            class="sidebar-btn sidebar-btn--logout"
            :aria-label="t('nav.logout')"
            :title="collapsed ? t('nav.logout') : undefined"
            @click="emit('logout')"
        >
            <span class="sidebar-icon">
                <AppIcon name="log-out" :size="18" />
            </span>
            <span v-if="!collapsed" class="sidebar-label">{{ t('nav.logout') }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import { toggleLocale } from '@/plugins/i18n'

const { t } = useI18n()

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
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.sidebar-btn {
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
    font-family: inherit;
    font-size: 0.95rem;
    transition: background 0.2s ease;
}

.sidebar-btn:hover {
    background: rgba(148, 163, 184, 0.2);
}

.sidebar-btn--logout {
    color: var(--color-text);
}

:global(.sidebar.collapsed) .sidebar-btn {
    justify-content: center;
    width: 90%;
    margin: 2px 3px;
    padding: 2px 3px;
}

.sidebar-icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.lang-icon {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--color-primary);
    border: 1.5px solid var(--color-primary);
    border-radius: 5px;
    width: 30px;
    height: 22px;
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
