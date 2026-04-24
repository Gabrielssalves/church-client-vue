<template>
    <section class="admin-view">
        <div class="header">
            <div class="title-group">
                <h1>{{ t('admin.scopes_title') }}</h1>
                <p>{{ t('admin.scopes_subtitle') }}</p>
            </div>
            <BaseButton variant="primary" size="lg" @click="openCreate">{{ t('admin.scopes_add') }}</BaseButton>
        </div>

        <div v-if="isLoading" class="loading-state">
            <span class="spinner" />
            <p>{{ t('admin.scopes_loading') }}</p>
        </div>

        <div v-else-if="scopes.length === 0" class="empty-state">
            <p>{{ t('admin.scopes_empty') }}</p>
            <BaseButton variant="primary" @click="openCreate">{{ t('admin.scopes_add_first') }}</BaseButton>
        </div>

        <div v-else class="items-grid">
            <BaseCard v-for="scope in scopes" :key="scope.id" class="item-card">
                <div class="item-card__header">
                    <div class="item-card__icon">
                        <AppIcon name="key" :size="18" />
                    </div>
                    <div class="item-card__info">
                        <h3>{{ scope.name }}</h3>
                        <code v-if="scope.code" class="scope-code">{{ scope.code }}</code>
                        <p v-if="scope.description">{{ scope.description }}</p>
                    </div>
                </div>
                <div class="item-card__actions">
                    <BaseButton variant="secondary" size="sm" @click="openEdit(scope)">{{ t('common.edit') }}</BaseButton>
                    <BaseButton variant="danger" size="sm" @click="confirmDelete(scope)">{{ t('common.delete') }}</BaseButton>
                </div>
            </BaseCard>
        </div>

        <Teleport to="body">
            <div v-if="showFormModal" class="modal-overlay" @click.self="closeForm">
                <div class="modal">
                    <div class="modal__header">
                        <h2>{{ editing ? t('admin.scopes_edit_title') : t('admin.scopes_new_title') }}</h2>
                        <button class="modal__close" @click="closeForm" :aria-label="t('common.close')">&times;</button>
                    </div>
                    <form class="modal__body" @submit.prevent="submitForm">
                        <div class="field">
                            <label>{{ t('admin.scope_name') }}</label>
                            <input v-model="form.name" type="text" :placeholder="t('admin.scope_name_placeholder')" required />
                        </div>
                        <div class="field">
                            <label>{{ t('admin.scope_code') }}</label>
                            <input v-model="form.code" type="text" :placeholder="t('admin.scope_code_placeholder')" class="input-mono" required />
                        </div>
                        <div class="field">
                            <label>{{ t('admin.scope_description') }}</label>
                            <input v-model="form.description" type="text" :placeholder="t('admin.scope_description_placeholder')" />
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
                        <p>{{ t('admin.scope_confirm_delete', { name: deleting?.name }) }}</p>
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
import { adminScopesService } from '@/services/adminScopesService'
import type { Scope } from '@/features/admin/types/Scope'

const { t } = useI18n()

const isLoading = ref(true)
const scopes = ref<Scope[]>([])

async function loadData() {
    try {
        scopes.value = await adminScopesService.getAll()
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)

const showFormModal = ref(false)
const editing = ref<Scope | null>(null)
const isSubmitting = ref(false)
const formError = ref('')
const form = reactive({ name: '', code: '', description: '' })

function openCreate() {
    editing.value = null
    form.name = ''; form.code = ''; form.description = ''
    formError.value = ''
    showFormModal.value = true
}

function openEdit(scope: Scope) {
    editing.value = scope
    form.name = scope.name; form.code = scope.code ?? ''; form.description = scope.description ?? ''
    formError.value = ''
    showFormModal.value = true
}

function closeForm() { showFormModal.value = false }

async function submitForm() {
    formError.value = ''
    isSubmitting.value = true
    try {
        const payload = { name: form.name, code: form.code || undefined, description: form.description || undefined }
        if (editing.value) {
            const updated = await adminScopesService.update(editing.value.id, payload)
            const idx = scopes.value.findIndex(s => s.id === editing.value!.id)
            if (idx !== -1) scopes.value[idx] = updated
        } else {
            const created = await adminScopesService.create(payload)
            scopes.value.push(created)
        }
        closeForm()
    } catch (err: unknown) {
        formError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

const showDeleteModal = ref(false)
const deleting = ref<Scope | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')

function confirmDelete(scope: Scope) {
    deleting.value = scope; deleteError.value = ''; showDeleteModal.value = true
}

async function executeDelete() {
    if (!deleting.value) return
    isDeleting.value = true; deleteError.value = ''
    try {
        await adminScopesService.delete(deleting.value.id)
        scopes.value = scopes.value.filter(s => s.id !== deleting.value!.id)
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
.item-card__info h3 { margin: 0; font-size: 1rem; font-family: monospace; word-break: break-all; }
.item-card__info p { margin: 0; font-size: 0.85rem; color: var(--color-text-light); }
.item-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }

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
.field input[type="text"] { padding: 9px 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s; background: var(--color-white); color: var(--color-text); }
.field input[type="text"]:focus { border-color: var(--color-primary); }
.input-mono { font-family: monospace !important; font-size: 0.9rem !important; letter-spacing: 0.02em; }
.form-error { margin: 0; color: #dc2626; font-size: 0.88rem; }

.scope-code { display: inline-block; font-family: monospace; font-size: 0.75rem; font-weight: 600; padding: 1px 7px; border-radius: 4px; background: var(--color-bg-contrast); color: var(--color-text); letter-spacing: 0.03em; margin-top: 2px; }

@media (max-width: 920px) {
    .items-grid { grid-template-columns: 1fr; }
    .header { flex-direction: column; align-items: flex-start; }
}
</style>
