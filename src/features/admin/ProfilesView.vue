<template>
    <section class="admin-view">
        <div class="header">
            <div class="title-group">
                <h1>{{ t('admin.profiles_title') }}</h1>
                <p>{{ t('admin.profiles_subtitle') }}</p>
            </div>
            <BaseButton variant="primary" size="lg" @click="openCreate">{{ t('admin.profiles_add') }}</BaseButton>
        </div>

        <div v-if="isLoading" class="loading-state">
            <span class="spinner" />
            <p>{{ t('admin.profiles_loading') }}</p>
        </div>

        <div v-else-if="profiles.length === 0" class="empty-state">
            <p>{{ t('admin.profiles_empty') }}</p>
            <BaseButton variant="primary" @click="openCreate">{{ t('admin.profiles_add_first') }}</BaseButton>
        </div>

        <div v-else class="items-grid">
            <BaseCard v-for="profile in profiles" :key="profile.id" class="item-card">
                <div class="item-card__header">
                    <div class="item-card__icon">
                        <AppIcon name="user-check" :size="18" />
                    </div>
                    <div class="item-card__info">
                        <h3>{{ profile.name }}</h3>
                        <p v-if="profile.description">{{ profile.description }}</p>
                    </div>
                </div>
                <div v-if="profile.scopes?.length" class="item-card__scopes">
                    <span v-for="scope in profile.scopes" :key="scope" class="scope-chip">{{ scope }}</span>
                </div>
                <div class="item-card__actions">
                    <BaseButton variant="secondary" size="sm" @click="openEdit(profile)">{{ t('common.edit') }}</BaseButton>
                    <BaseButton variant="danger" size="sm" @click="confirmDelete(profile)">{{ t('common.delete') }}</BaseButton>
                </div>
            </BaseCard>
        </div>

        <Teleport to="body">
            <div v-if="showFormModal" class="modal-overlay" @click.self="closeForm">
                <div class="modal">
                    <div class="modal__header">
                        <h2>{{ editing ? t('admin.profiles_edit_title') : t('admin.profiles_new_title') }}</h2>
                        <button class="modal__close" @click="closeForm" :aria-label="t('common.close')">&times;</button>
                    </div>
                    <form class="modal__body" @submit.prevent="submitForm">
                        <div class="field">
                            <label>{{ t('admin.profile_name') }}</label>
                            <input v-model="form.name" type="text" :placeholder="t('admin.profile_name_placeholder')" required />
                        </div>
                        <div class="field">
                            <label>{{ t('admin.profile_description') }}</label>
                            <input v-model="form.description" type="text" :placeholder="t('admin.profile_description_placeholder')" />
                        </div>
                        <div class="field">
                            <label>{{ t('admin.profile_scopes') }}</label>
                            <div class="scopes-check-list">
                                <label v-for="scope in allScopes" :key="scope.id" class="scope-check"
                                    :class="{ 'scope-check--selected': form.scopes.includes(scope.name) }">
                                    <input type="checkbox" :value="scope.name" v-model="form.scopes" />
                                    <span class="scope-chip">{{ scope.name }}</span>
                                </label>
                                <p v-if="allScopes.length === 0" class="scopes-empty">
                                    {{ t('admin.profile_no_scopes') }}
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
                        <p>{{ t('admin.profile_confirm_delete', { name: deleting?.name }) }}</p>
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
import AppIcon from '@/components/ui/AppIcon.vue'
import { adminProfilesService } from '@/services/adminProfilesService'
import { adminScopesService } from '@/services/adminScopesService'
import type { Profile } from '@/features/admin/types/Profile'
import type { Scope } from '@/features/admin/types/Scope'

const { t } = useI18n()

const isLoading = ref(true)
const profiles = ref<Profile[]>([])
const allScopes = ref<Scope[]>([])

async function loadData() {
    try {
        const [profilesData, scopesData] = await Promise.all([
            adminProfilesService.getAll(),
            adminScopesService.getAll(),
        ])
        profiles.value = profilesData
        allScopes.value = scopesData
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)

const showFormModal = ref(false)
const editing = ref<Profile | null>(null)
const isSubmitting = ref(false)
const formError = ref('')
const form = reactive({ name: '', description: '', scopes: [] as string[] })

function openCreate() {
    editing.value = null
    form.name = ''; form.description = ''; form.scopes = []
    formError.value = ''
    showFormModal.value = true
}

function openEdit(profile: Profile) {
    editing.value = profile
    form.name = profile.name
    form.description = profile.description ?? ''
    form.scopes = [...(profile.scopes ?? [])]
    formError.value = ''
    showFormModal.value = true
}

function closeForm() { showFormModal.value = false }

async function submitForm() {
    formError.value = ''
    isSubmitting.value = true
    try {
        const payload = { name: form.name, description: form.description || undefined, scopes: form.scopes }
        if (editing.value) {
            const updated = await adminProfilesService.update(editing.value.id, payload)
            const idx = profiles.value.findIndex(p => p.id === editing.value!.id)
            if (idx !== -1) profiles.value[idx] = updated
        } else {
            const created = await adminProfilesService.create(payload)
            profiles.value.push(created)
        }
        closeForm()
    } catch (err: unknown) {
        formError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

const showDeleteModal = ref(false)
const deleting = ref<Profile | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')

function confirmDelete(profile: Profile) {
    deleting.value = profile; deleteError.value = ''; showDeleteModal.value = true
}

async function executeDelete() {
    if (!deleting.value) return
    isDeleting.value = true; deleteError.value = ''
    try {
        await adminProfilesService.delete(deleting.value.id)
        profiles.value = profiles.value.filter(p => p.id !== deleting.value!.id)
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

.items-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.item-card { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.item-card__header { display: flex; align-items: flex-start; gap: 12px; }
.item-card__icon { width: 36px; height: 36px; border-radius: 8px; background: var(--color-primary-light, rgba(20,167,74,0.1)); display: grid; place-items: center; color: var(--color-primary); flex-shrink: 0; }
.item-card__info { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.item-card__info h3 { margin: 0; font-size: 1rem; }
.item-card__info p { margin: 0; font-size: 0.85rem; color: var(--color-text-light); }
.item-card__scopes { display: flex; flex-wrap: wrap; gap: 6px; }
.item-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }

.scope-chip { font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--color-bg-contrast, #e5e7eb); color: var(--color-text); font-family: monospace; }

.scopes-check-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto; padding: 2px; }
.scope-check { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 6px 8px; border-radius: 8px; border: 2px solid transparent; transition: background 0.15s, border-color 0.15s; }
.scope-check:hover { background: var(--color-bg); }
.scope-check--selected { border-color: var(--color-primary); background: var(--skill-check-selected-bg, rgba(20,167,74,0.05)); }
.scope-check input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--color-primary); flex-shrink: 0; }
.scopes-empty { margin: 0; color: var(--color-text-light); font-size: 0.88rem; text-align: center; padding: 8px 0; }

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
.field input[type="text"] { padding: 9px 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
.field input[type="text"]:focus { border-color: var(--color-primary); }
.form-error { margin: 0; color: #dc2626; font-size: 0.88rem; }

@media (max-width: 920px) {
    .items-grid { grid-template-columns: 1fr; }
    .header { flex-direction: column; align-items: flex-start; }
}
</style>
