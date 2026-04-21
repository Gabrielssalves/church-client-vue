<script setup lang="ts">
import { toggleTheme, isDark } from '@/plugins/theme'
</script>

<template>
    <button
        class="theme-toggle"
        type="button"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
    >
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    </button>
</template>

<style scoped>
.theme-toggle {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 200;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background: var(--color-white);
    color: var(--color-text);
    display: grid;
    place-items: center;
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.theme-toggle:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}
</style>
