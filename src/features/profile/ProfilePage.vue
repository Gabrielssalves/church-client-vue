<template>
    <section class="profile-view">
        <div class="page-header">
            <div>
                <h1>{{ t('profile.title') }}</h1>
                <p>{{ t('profile.subtitle') }}</p>
            </div>
        </div>

        <!-- ── Personal + Security form ── -->
        <form @submit.prevent="submitForm">
            <div class="settings-divider" />

            <div class="settings-row">
                <div class="settings-row__meta">
                    <h2>{{ t('profile.section_personal') }}</h2>
                    <p>{{ t('profile.section_personal_desc') }}</p>
                </div>
                <div class="settings-row__fields">
                    <div class="field-group">
                        <BaseAvatar :name="displayName" :size="52" />
                        <div class="identity-text">
                            <span class="identity-name">{{ displayName }}</span>
                            <span class="identity-email">{{ user?.email }}</span>
                        </div>
                    </div>
                    <div class="field">
                        <label>{{ t('profile.name') }}</label>
                        <input v-model="form.name" type="text" :placeholder="t('profile.name_placeholder')" />
                    </div>
                    <div class="field">
                        <label>{{ t('profile.email') }}</label>
                        <input :value="user?.email" type="email" disabled class="input--disabled" />
                    </div>
                </div>
            </div>

            <div class="settings-divider" />

            <div class="settings-row">
                <div class="settings-row__meta">
                    <h2>{{ t('profile.section_security') }}</h2>
                    <p>{{ t('profile.section_security_desc') }}</p>
                </div>
                <div class="settings-row__fields">
                    <div class="field">
                        <label>{{ t('profile.current_password') }}</label>
                        <input v-model="form.currentPassword" type="password"
                            :placeholder="t('profile.current_password_placeholder')" autocomplete="current-password" />
                    </div>
                    <div class="field">
                        <label>{{ t('profile.new_password') }}</label>
                        <input v-model="form.newPassword" type="password"
                            :placeholder="t('profile.new_password_placeholder')" autocomplete="new-password" />
                    </div>
                    <div class="field">
                        <label>{{ t('profile.confirm_password') }}</label>
                        <input v-model="form.confirmPassword" type="password"
                            :placeholder="t('profile.confirm_password_placeholder')" autocomplete="new-password" />
                    </div>
                </div>
            </div>

            <div class="settings-divider" />

            <div class="form-footer">
                <p v-if="successMessage" class="msg msg--success">{{ successMessage }}</p>
                <p v-if="formError" class="msg msg--error">{{ formError }}</p>
                <div class="form-actions">
                    <BaseButton variant="secondary" type="button" @click="resetForm">{{ t('common.cancel') }}
                    </BaseButton>
                    <BaseButton variant="primary" type="submit" :loading="isSubmitting">{{ t('common.save') }}
                    </BaseButton>
                </div>
            </div>
        </form>

        <!-- ── Integrations (claim-gated) ── -->
        <template v-if="!hasClaim">
            <div class="settings-divider" />

            <div class="settings-row">
                <div class="settings-row__meta">
                    <h2>{{ t('profile.section_integrations') }}</h2>
                    <p>{{ t('profile.section_integrations_desc') }}</p>
                </div>
                <div class="settings-row__fields">

                    <!-- Google Calendar card -->
                    <div class="integration-card">
                        <div class="integration-card__header">
                            <span class="integration-card__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
                                    <path fill="#4285F4"
                                        d="M45.5 24.5c0-1.4-.1-2.7-.4-4H24v7.6h12.1c-.5 2.7-2.1 5-4.4 6.5v5.4h7.1c4.2-3.8 6.7-9.5 6.7-15.5z" />
                                    <path fill="#34A853"
                                        d="M24 46c6 0 11.1-2 14.8-5.4l-7.1-5.4c-2 1.3-4.5 2.1-7.7 2.1-5.9 0-10.9-4-12.7-9.3H4v5.6C7.7 41.6 15.3 46 24 46z" />
                                    <path fill="#FBBC05"
                                        d="M11.3 28c-.5-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1V14H4c-1.4 2.8-2.1 5.9-2.1 9.1S2.6 30.3 4 33.1l7.3-5.1z" />
                                    <path fill="#EA4335"
                                        d="M24 10.7c3.3 0 6.3 1.1 8.6 3.4l6.5-6.5C35.1 3.9 30 2 24 2 15.3 2 7.7 6.4 4 14l7.3 5.6C13.1 14.7 18.1 10.7 24 10.7z" />
                                </svg>
                            </span>
                            <div class="integration-card__info">
                                <p class="integration-card__name">{{ t('profile.integration_google_calendar') }}</p>
                                <p class="integration-card__desc">{{ t('profile.integration_google_calendar_desc') }}
                                </p>
                            </div>
                            <span v-if="!gcal.isLoading" class="integration-status"
                                :class="gcal.status?.connected ? 'integration-status--on' : 'integration-status--off'">
                                <span class="integration-status__dot" />
                                {{ gcal.status?.connected
                                    ? t('profile.integration_connected')
                                    : t('profile.integration_not_connected') }}
                            </span>
                        </div>

                        <div v-if="gcal.isLoading" class="integration-card__body integration-card__body--loading">
                            <span class="spinner" />
                        </div>

                        <div v-else class="integration-card__body">
                            <p v-if="gcal.status?.connected && gcal.status.email" class="integration-account">
                                {{ gcal.status.email }}
                            </p>
                            <BaseButton v-if="gcal.status?.connected" variant="secondary" size="sm"
                                :loading="gcal.isDisconnecting" @click="disconnectCalendar">
                                {{ t('profile.integration_disconnect') }}
                            </BaseButton>
                            <BaseButton v-else variant="primary" size="sm" :loading="gcal.isConnecting"
                                @click="connectCalendar">
                                {{ t('profile.integration_connect') }}
                            </BaseButton>
                        </div>

                        <p v-if="gcal.error" class="msg msg--error" style="padding: 0 16px 14px;">{{ gcal.error }}</p>
                    </div>

                </div>
            </div>
        </template>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useFeatureClaim } from '@/composables/useFeatureClaim'
import { profileService } from '@/services/profileService'
import { integrationsService, type GoogleCalendarStatus } from '@/services/integrationsService'
import BaseAvatar from '@/components/BaseAvatar.vue'
import BaseButton from '@/components/BaseButton.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const displayName = computed(() => user.value?.name ?? user.value?.email ?? '?')

// ── Profile form ──────────────────────────────────────────────
const isSubmitting = ref(false)
const formError = ref('')
const successMessage = ref('')

const form = reactive({
    name: user.value?.name ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
})

function resetForm() {
    form.name = user.value?.name ?? ''
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    formError.value = ''
    successMessage.value = ''
}

async function submitForm() {
    formError.value = ''
    successMessage.value = ''

    const hasPasswordFields = form.currentPassword || form.newPassword || form.confirmPassword
    if (hasPasswordFields) {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            formError.value = t('profile.password_incomplete')
            return
        }
        if (form.newPassword !== form.confirmPassword) {
            formError.value = t('profile.password_mismatch')
            return
        }
    }

    isSubmitting.value = true
    try {
        const payload: Record<string, string> = {}
        if (form.name && form.name !== user.value?.name) payload.name = form.name
        if (hasPasswordFields) {
            payload.currentPassword = form.currentPassword
            payload.newPassword = form.newPassword
        }

        if (Object.keys(payload).length === 0) {
            successMessage.value = t('profile.save_success')
            return
        }

        const updated = await profileService.update(payload)
        authStore.updateUser(updated)
        form.name = updated.name ?? form.name
        form.currentPassword = ''
        form.newPassword = ''
        form.confirmPassword = ''
        successMessage.value = t('profile.save_success')
    } catch (err: unknown) {
        formError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

// ── Integrations ──────────────────────────────────────────────
const { hasClaim } = useFeatureClaim('google-calendar:connect')

const gcal = reactive({
    isLoading: true,
    isConnecting: false,
    isDisconnecting: false,
    status: null as GoogleCalendarStatus | null,
    error: '',
})

onMounted(async () => {
    if (hasClaim.value) return
    try {
        gcal.status = await integrationsService.getGoogleCalendarStatus()
    } catch {
        // silent — section still renders, just without status
    } finally {
        gcal.isLoading = false
    }
})

async function connectCalendar() {
    gcal.isConnecting = true
    gcal.error = ''
    try {
        const { url } = await integrationsService.getGoogleCalendarConnectUrl()
        window.location.href = url
    } catch {
        gcal.error = t('profile.integration_error')
        gcal.isConnecting = false
    }
}

async function disconnectCalendar() {
    gcal.isDisconnecting = true
    gcal.error = ''
    try {
        await integrationsService.disconnectGoogleCalendar()
        gcal.status = { connected: false, email: undefined }
    } catch {
        gcal.error = t('profile.integration_error')
    } finally {
        gcal.isDisconnecting = false
    }
}
</script>

<style scoped>
.profile-view {
    max-width: 1060px;
    margin: 0 auto;
    padding: 36px 24px 48px;
}

.page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 8px;
}

h1 {
    margin: 0 0 6px;
    font-size: 2rem;
}

.page-header p {
    margin: 0;
    color: var(--color-text-light);
}

/* ── Divider ── */
.settings-divider {
    height: 1px;
    background: var(--border-color);
    margin: 28px 0;
}

/* ── Settings row: meta | fields ── */
.settings-row {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 48px;
    align-items: start;
}

.settings-row__meta h2 {
    margin: 0 0 6px;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-text);
}

.settings-row__meta p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-text-light);
    line-height: 1.6;
}

.settings-row__fields {
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 480px;
}

/* ── Identity preview ── */
.field-group {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    background: var(--color-bg);
    border: 1px solid var(--border-color);
    border-radius: 4px;
}

.identity-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.identity-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.identity-email {
    font-size: 0.82rem;
    color: var(--color-text-light);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ── Fields ── */
.field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.field label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text);
}

.field input[type="text"],
.field input[type="email"],
.field input[type="password"] {
    padding: 8px 11px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-family: inherit;
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.15s;
    background: var(--color-white);
    color: var(--color-text);
    width: 100%;
    box-sizing: border-box;
}

.field input:focus {
    border-color: var(--color-primary);
}

.input--disabled {
    background: var(--color-bg) !important;
    color: var(--color-text-light) !important;
    cursor: not-allowed;
}

/* ── Form footer ── */
.form-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}

.msg {
    margin: 0;
    font-size: 0.87rem;
    font-weight: 500;
}

.msg--success {
    color: var(--color-primary);
}

.msg--error {
    color: #dc2626;
}

.form-actions {
    display: flex;
    gap: 10px;
}

/* ── Integration card ── */
.integration-card {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
}

.integration-card__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    background: var(--color-bg);
}

.integration-card__icon {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    background: var(--color-white);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    flex-shrink: 0;
}

.integration-card__info {
    flex: 1;
    min-width: 0;
}

.integration-card__name {
    margin: 0 0 2px;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-text);
}

.integration-card__desc {
    margin: 0;
    font-size: 0.78rem;
    color: var(--color-text-light);
    line-height: 1.4;
}

.integration-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 99px;
    white-space: nowrap;
    flex-shrink: 0;
}

.integration-status--on {
    background: var(--status-active-bg);
    color: var(--status-active-color);
}

.integration-status--off {
    background: var(--status-inactive-bg);
    color: var(--status-inactive-color);
}

.integration-status__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
}

.integration-card__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: var(--color-white);
}

.integration-card__body--loading {
    justify-content: center;
    padding: 16px;
}

.integration-account {
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-text-light);
}

/* ── Spinner ── */
.spinner {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--color-bg-contrast);
    border-top-color: var(--color-primary);
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Responsive ── */
@media (max-width: 860px) {
    .settings-row {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .settings-row__fields {
        max-width: 100%;
    }

    .form-footer {
        flex-direction: column;
        align-items: flex-end;
    }

    .integration-card__header {
        flex-wrap: wrap;
    }
}
</style>
