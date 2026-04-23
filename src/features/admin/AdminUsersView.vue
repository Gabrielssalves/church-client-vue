<template>
    <section class="admin-view">
        <div class="header">
            <div class="title-group">
                <h1>{{ t('admin.users_title') }}</h1>
                <p>{{ t('admin.users_subtitle') }}</p>
            </div>
            <BaseButton variant="primary" size="lg" @click="openCreate">{{ t('admin.users_add') }}</BaseButton>
        </div>

        <div v-if="isLoading" class="loading-state">
            <span class="spinner" />
            <p>{{ t('admin.users_loading') }}</p>
        </div>

        <div v-else-if="users.length === 0" class="empty-state">
            <p>{{ t('admin.users_empty') }}</p>
            <BaseButton variant="primary" @click="openCreate">{{ t('admin.users_add_first') }}</BaseButton>
        </div>

        <div v-else class="users-grid">
            <BaseCard v-for="user in users" :key="user.id" class="user-card">
                <div class="user-card__header">
                    <BaseAvatar :name="user.name ?? user.email" />
                    <div class="user-card__info">
                        <div class="user-card__name-row">
                            <h3>{{ user.name ?? user.email }}</h3>
                            <span class="status-badge"
                                :class="user.active ? 'status-badge--active' : 'status-badge--inactive'">
                                {{ user.active ? t('common.active') : t('common.inactive') }}
                            </span>
                        </div>
                        <small>{{ user.email }}</small>
                    </div>
                </div>
                <div v-if="user.profiles?.length" class="user-card__profiles">
                    <span v-for="profile in user.profiles" :key="profile" class="profile-chip">{{ profile }}</span>
                </div>
                <div class="user-card__actions">
                    <BaseButton variant="secondary" size="sm" @click="openEdit(user)">{{ t('common.edit') }}</BaseButton>
                    <BaseButton variant="danger" size="sm" @click="confirmDelete(user)">{{ t('common.delete') }}</BaseButton>
                </div>
            </BaseCard>
        </div>

        <Teleport to="body">
            <div v-if="showFormModal" class="modal-overlay" @click.self="closeForm">
                <div class="modal">
                    <div class="modal__header">
                        <h2>{{ editing ? t('admin.users_edit_title') : t('admin.users_new_title') }}</h2>
                        <button class="modal__close" @click="closeForm" :aria-label="t('common.close')">&times;</button>
                    </div>
                    <form class="modal__body" @submit.prevent="submitForm">
                        <div class="field">
                            <label>{{ t('admin.user_name') }}</label>
                            <input v-model="form.name" type="text" :placeholder="t('admin.user_name_placeholder')" />
                        </div>
                        <div class="field">
                            <label>{{ t('admin.user_email') }}</label>
                            <input v-model="form.email" type="email" :placeholder="t('admin.user_email_placeholder')" required />
                        </div>
                        <div v-if="!editing" class="field">
                            <label>{{ t('admin.user_password') }}</label>
                            <input v-model="form.password" type="password" :placeholder="t('admin.user_password_placeholder')" required />
                        </div>
                        <div class="field field--checkbox">
                            <label>
                                <input v-model="form.active" type="checkbox" />
                                {{ t('admin.user_active') }}
                            </label>
                        </div>
                        <div class="field">
                            <label>{{ t('admin.user_profiles') }}</label>
                            <div class="profiles-check-list">
                                <label v-for="profile in allProfiles" :key="profile.id" class="profile-check"
                                    :class="{ 'profile-check--selected': form.profiles.includes(profile.name) }">
                                    <input type="checkbox" :value="profile.name" v-model="form.profiles" />
                                    <span class="profile-chip">{{ profile.name }}</span>
                                </label>
                                <p v-if="allProfiles.length === 0" class="profiles-empty">
                                    {{ t('admin.user_no_profiles') }}
                                </p>
                            </div>
                        </div>
                        <p v-if="formError" class="form-error">{{ formError }}</p>
                        <div class="modal__footer">
                            <BaseButton variant="secondary" type="button" @click="closeForm">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="primary" type="submit" :loading="isSubmitting">
                                {{ editing ? t('common.save') : t('common.create') }}
                            </BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
                <div class="modal modal--sm">
                    <div class="modal__header">
                        <h2>{{ t('common.confirm_delete') }}</h2>
                        <button class="modal__close" @click="showDeleteModal = false" :aria-label="t('common.close')">&times;</button>
                    </div>
                    <div class="modal__body">
                        <p>{{ t('admin.user_confirm_delete', { name: deleting?.name ?? deleting?.email }) }}</p>
                        <p v-if="deleteError" class="form-error">{{ deleteError }}</p>
                        <div class="modal__footer">
                            <BaseButton variant="secondary" @click="showDeleteModal = false">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="danger" :loading="isDeleting" @click="executeDelete">{{ t('common.delete') }}</BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseAvatar from '@/components/BaseAvatar.vue'
import { adminUsersService } from '@/services/adminUsersService'
import { adminProfilesService } from '@/services/adminProfilesService'
import type { AdminUser } from '@/features/admin/types/AdminUser'
import type { Profile } from '@/features/admin/types/Profile'

const { t } = useI18n()

const isLoading = ref(true)
const users = ref<AdminUser[]>([])
const allProfiles = ref<Profile[]>([])

async function loadData() {
    try {
        const [usersData, profilesData] = await Promise.all([
            adminUsersService.getAll(),
            adminProfilesService.getAll(),
        ])
        users.value = usersData
        allProfiles.value = profilesData
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)

const showFormModal = ref(false)
const editing = ref<AdminUser | null>(null)
const isSubmitting = ref(false)
const formError = ref('')
const form = reactive({ name: '', email: '', password: '', active: true, profiles: [] as string[] })

function openCreate() {
    editing.value = null
    form.name = ''; form.email = ''; form.password = ''; form.active = true; form.profiles = []
    formError.value = ''
    showFormModal.value = true
}

function openEdit(user: AdminUser) {
    editing.value = user
    form.name = user.name ?? ''
    form.email = user.email
    form.password = ''
    form.active = user.active
    form.profiles = [...(user.profiles ?? [])]
    formError.value = ''
    showFormModal.value = true
}

function closeForm() { showFormModal.value = false }

async function submitForm() {
    formError.value = ''
    isSubmitting.value = true
    try {
        if (editing.value) {
            const payload = { name: form.name || undefined, email: form.email, active: form.active, profiles: form.profiles }
            const updated = await adminUsersService.update(editing.value.id, payload)
            const idx = users.value.findIndex(u => u.id === editing.value!.id)
            if (idx !== -1) users.value[idx] = updated
        } else {
            const payload = { name: form.name || undefined, email: form.email, password: form.password, active: form.active, profiles: form.profiles }
            const created = await adminUsersService.create(payload)
            users.value.push(created)
        }
        closeForm()
    } catch (err: unknown) {
        formError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

const showDeleteModal = ref(false)
const deleting = ref<AdminUser | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')

function confirmDelete(user: AdminUser) {
    deleting.value = user; deleteError.value = ''; showDeleteModal.value = true
}

async function executeDelete() {
    if (!deleting.value) return
    isDeleting.value = true; deleteError.value = ''
    try {
        await adminUsersService.delete(deleting.value.id)
        users.value = users.value.filter(u => u.id !== deleting.value!.id)
        showDeleteModal.value = false
    } catch (err: unknown) {
        deleteError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isDeleting.value = false
    }
}
</script>

<style scoped>
.admin-view { max-width: 1060px; margin: 0 auto; padding: 36px 24px 48px; }

.header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 32px; }
.title-group { max-width: 720px; }
h1 { margin: 0 0 8px; font-size: 2rem; }
.title-group p { margin: 0; color: var(--color-text-light); line-height: 1.7; }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px 0; color: var(--color-text-light); }
.spinner { display: block; width: 32px; height: 32px; border-radius: 50%; border: 3px solid var(--color-bg-contrast); border-top-color: var(--color-primary); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 80px 0; color: var(--color-text-light); display: flex; flex-direction: column; align-items: center; gap: 16px; }

.users-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.user-card { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.user-card__header { display: flex; align-items: flex-start; gap: 14px; }
.user-card__info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.user-card__name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.user-card__info h3 { margin: 0; font-size: 1.05rem; }
.user-card__info small { display: block; color: var(--color-text-light); font-size: 0.85rem; }

.status-badge { font-size: 0.7rem; font-weight: 600; padding: 2px 7px; border-radius: 999px; }
.status-badge--active   { background: var(--status-active-bg);   color: var(--status-active-color); }
.status-badge--inactive { background: var(--status-inactive-bg); color: var(--status-inactive-color); }

.user-card__profiles { display: flex; flex-wrap: wrap; gap: 6px; }
.user-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }

.profile-chip { font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--color-bg-contrast, #e5e7eb); color: var(--color-text); }

.profiles-check-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; padding: 2px; }
.profile-check { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 6px 8px; border-radius: 8px; border: 2px solid transparent; transition: background 0.15s, border-color 0.15s; }
.profile-check:hover { background: var(--color-bg); }
.profile-check--selected { border-color: var(--color-primary); background: var(--skill-check-selected-bg, rgba(20,167,74,0.05)); }
.profile-check input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--color-primary); flex-shrink: 0; }
.profiles-empty { margin: 0; color: var(--color-text-light); font-size: 0.88rem; text-align: center; padding: 8px 0; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; overflow-y: auto; }
.modal { background: var(--color-white); border-radius: 14px; width: 100%; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.18); margin: auto; }
.modal--sm { max-width: 380px; }
.modal__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
.modal__header h2 { margin: 0; font-size: 1.2rem; }
.modal__close { background: none; border: none; font-size: 1.6rem; cursor: pointer; color: var(--color-text-light); line-height: 1; padding: 0 4px; }
.modal__close:hover { color: var(--color-text); }
.modal__body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.modal__footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.9rem; font-weight: 600; color: var(--color-text); }
.field input[type="text"],
.field input[type="email"],
.field input[type="password"] { padding: 9px 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
.field input[type="text"]:focus,
.field input[type="email"]:focus,
.field input[type="password"]:focus { border-color: var(--color-primary); }
.field--checkbox label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500; }
.field--checkbox input[type="checkbox"] { accent-color: var(--color-primary); width: 16px; height: 16px; }
.form-error { margin: 0; color: #dc2626; font-size: 0.88rem; }

@media (max-width: 920px) {
    .users-grid { grid-template-columns: 1fr; }
    .header { flex-direction: column; align-items: flex-start; }
}
</style>
