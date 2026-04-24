<template>
    <div class="sidebar-footer">
        <Teleport to="body">
            <div v-if="popupOpen" class="profile-backdrop" @click="close" />
            <Transition name="popup">
                <div v-if="popupOpen" class="profile-popup" :style="popupStyle">
                    <div class="popup-header">
                        <BaseAvatar :name="displayName" :size="44" />
                        <div class="popup-user-info">
                            <p class="popup-name">{{ displayName }}</p>
                            <p class="popup-email">{{ user?.email }}</p>
                        </div>
                    </div>

                    <div class="popup-sep" />

                    <button class="popup-action" @click="goToProfile">
                        <AppIcon name="user" :size="15" />
                        <span>{{ t('sidebar.edit_profile') }}</span>
                    </button>

                    <button class="popup-action" @click="handleToggleLocale">
                        <AppIcon name="globe" :size="15" />
                        <span>{{ t('sidebar.language') }}</span>
                        <span class="popup-action__lang">{{ t('sidebar.lang') }}</span>
                    </button>

                    <div class="popup-sep" />

                    <button class="popup-action popup-action--danger" @click="handleLogout">
                        <AppIcon name="log-out" :size="15" />
                        <span>{{ t('nav.logout') }}</span>
                    </button>
                </div>
            </Transition>
        </Teleport>

        <button
            type="button"
            class="profile-trigger"
            :class="{ 'profile-trigger--collapsed': collapsed }"
            :aria-expanded="popupOpen"
            :title="collapsed ? displayName : undefined"
            ref="triggerRef"
            @click="toggle"
        >
            <BaseAvatar :name="displayName" :size="30" />
            <span v-if="!collapsed" class="profile-trigger__name">{{ displayName }}</span>
            <span v-if="!collapsed" class="profile-trigger__chevron" :class="{ open: popupOpen }">
                <AppIcon name="chevron-down" :size="14" />
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseAvatar from '@/components/BaseAvatar.vue'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

defineProps<{ collapsed: boolean }>()

const user = computed(() => authStore.user)
const displayName = computed(() => user.value?.name ?? user.value?.email ?? '?')

const popupOpen = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
const popupStyle = ref<Record<string, string>>({})

function open() {
    if (!triggerRef.value) return
    const rect = triggerRef.value.getBoundingClientRect()
    popupStyle.value = {
        bottom: `${window.innerHeight - rect.top + 12}px`,
        left: `${rect.left}px`,
        width: `${Math.max(240, rect.width)}px`,
    }
    popupOpen.value = true
}

function close() {
    popupOpen.value = false
}

function toggle() {
    if (popupOpen.value) close()
    else open()
}

function goToProfile() {
    close()
    router.push('/profile')
}

function handleToggleLocale() {
    toggleLocale()
}

function handleLogout() {
    close()
    authStore.clearSession()
    router.push('/login')
}
</script>

<style scoped>
.sidebar-footer {
    margin-top: auto;
    padding: 8px 10px;
    border-top: 1px solid rgba(148, 163, 184, 0.2);
}

/* ── Trigger ── */
.profile-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--color-text);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    transition: background 0.2s ease;
    text-align: left;
    min-width: 0;
}

.profile-trigger:hover {
    background: rgba(148, 163, 184, 0.2);
}

.profile-trigger--collapsed {
    justify-content: center;
    padding: 6px;
}

.profile-trigger__name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.profile-trigger__chevron {
    flex-shrink: 0;
    color: var(--color-text-light);
    transition: transform 0.2s ease;
}

.profile-trigger__chevron.open {
    transform: rotate(180deg);
}
</style>

<style>
/* ── Popup (global — teleported outside scoped component) ── */
.profile-backdrop {
    position: fixed;
    inset: 0;
    z-index: 299;
}

.profile-popup {
    position: fixed;
    z-index: 300;
    background: var(--color-white);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
    padding: 6px;
    min-width: 240px;
    overflow: hidden;
}

.popup-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 10px 12px;
}

.popup-user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
}

.popup-name {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.popup-email {
    margin: 0;
    font-size: 0.78rem;
    color: var(--color-text-light);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.popup-sep {
    height: 1px;
    background: var(--border-color);
    margin: 4px 0;
}

.popup-action {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--color-text);
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease;
}

.popup-action:hover {
    background: rgba(148, 163, 184, 0.15);
}

.popup-action__lang {
    margin-left: auto;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--color-primary);
    border: 1.5px solid var(--color-primary);
    border-radius: 4px;
    padding: 1px 5px;
}

.popup-action--danger {
    color: #dc2626;
}

.popup-action--danger:hover {
    background: rgba(220, 38, 38, 0.08);
}

/* ── Transition ── */
.popup-enter-active,
.popup-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.popup-enter-from,
.popup-leave-to {
    opacity: 0;
    transform: translateY(6px);
}
</style>
