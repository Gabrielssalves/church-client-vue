<template>
    <section class="users-view">
        <div class="header">
            <div class="title-group">
                <h1>{{ t('users.title') }}</h1>
                <p>{{ t('users.subtitle') }}</p>
            </div>
            <BaseButton v-if="canWrite" variant="primary" size="lg" @click="openCreate">{{ t('users.add') }}</BaseButton>
        </div>

        <div v-if="isLoading" class="loading-state">
            <span class="spinner" />
            <p>{{ t('users.loading') }}</p>
        </div>

        <div v-else-if="canRead && users.length === 0" class="empty-state">
            <p>{{ t('users.empty') }}</p>
            <BaseButton v-if="canWrite" variant="primary" @click="openCreate">{{ t('users.add_first') }}</BaseButton>
        </div>

        <div v-else-if="canRead" class="users-grid">
            <BaseCard v-for="user in users" :key="user.id" class="user-card">
                <div class="user-card__header">
                    <BaseAvatar :name="user.name" />
                    <div class="user-card__info">
                        <div class="user-card__name-row">
                            <h3>{{ user.name }}</h3>
                            <span class="status-badge"
                                :class="user.active ? 'status-badge--active' : 'status-badge--inactive'">
                                {{ user.active ? t('common.active') : t('common.inactive') }}
                            </span>
                        </div>
                        <small>{{ user.email }}</small>
                        <small>{{ user.phoneNumber }}</small>
                    </div>
                </div>

                <div class="user-card__skills">
                    <BaseBadge v-for="skill in user.skills" :key="skill.id" :color="skill.color">
                        {{ skill.name }}
                    </BaseBadge>
                    <span v-if="user.skills.length === 0" class="no-skills">{{ t('users.no_skills') }}</span>
                </div>

                <div v-if="canWrite || canDelete" class="user-card__actions">
                    <BaseButton v-if="canWrite" variant="secondary" size="sm" @click="openEdit(user)">{{ t('common.edit') }}</BaseButton>
                    <BaseButton v-if="canDelete" variant="danger" size="sm" @click="confirmDelete(user)">{{ t('common.delete') }}</BaseButton>
                </div>
            </BaseCard>
        </div>

        <!-- Unified Create / Edit Modal -->
        <Teleport to="body">
            <div v-if="showFormModal" class="modal-overlay" @click.self="closeForm">
                <div class="modal">
                    <div class="modal__header">
                        <h2>{{ editingUser ? t('users.edit_title') : t('users.new_title') }}</h2>
                        <button class="modal__close" @click="closeForm" :aria-label="t('common.close')">&times;</button>
                    </div>

                    <form class="modal__body" @submit.prevent="submitForm">
                        <div class="field">
                            <label>{{ t('common.name') }}</label>
                            <input v-model="form.name" type="text" :placeholder="t('users.full_name_placeholder')" required />
                        </div>
                        <div class="field">
                            <label>{{ t('login.email') }}</label>
                            <input v-model="form.email" type="email" :placeholder="t('users.email_placeholder')" required />
                        </div>
                        <div class="field">
                            <label>{{ t('users.phone') }}</label>
                            <input v-model="form.phoneNumber" type="tel" :placeholder="t('users.phone_placeholder')" required />
                        </div>
                        <div class="field field--checkbox">
                            <label>
                                <input v-model="form.active" type="checkbox" />
                                {{ t('users.active_label') }}
                            </label>
                        </div>

                        <div class="field">
                            <label>{{ t('users.skills_section') }}</label>
                            <div class="skills-check-list">
                                <label v-for="skill in allSkills" :key="skill.id" class="skill-check"
                                    :class="{ 'skill-check--selected': form.skillIds.includes(skill.id) }">
                                    <input type="checkbox" :value="skill.id" v-model="form.skillIds" />
                                    <BaseBadge :color="skill.color">{{ skill.name }}</BaseBadge>
                                </label>
                                <p v-if="allSkills.length === 0" class="skills-empty">
                                    {{ t('users.no_skills_registered') }}
                                </p>
                            </div>
                        </div>

                        <p v-if="formError" class="form-error">{{ formError }}</p>

                        <div class="modal__footer">
                            <BaseButton variant="secondary" type="button" @click="closeForm">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="primary" type="submit" :loading="isSubmitting">
                                {{ editingUser ? t('common.save') : t('common.create') }}
                            </BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirm Modal -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
                <div class="modal modal--sm">
                    <div class="modal__header">
                        <h2>{{ t('common.confirm_delete') }}</h2>
                        <button class="modal__close" @click="showDeleteModal = false" :aria-label="t('common.close')">&times;</button>
                    </div>
                    <div class="modal__body">
                        <p>{{ t('users.confirm_delete_msg', { name: deletingUser?.name }) }}</p>
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
import BaseBadge from '@/components/BaseBadge.vue'
import { usersService } from '@/services/usersService'
import { skillsService } from '@/services/skillsService'
import type { User } from '@/features/users/types/User'
import type { Skill } from '@/features/skills/types/Skill'
import { useScope } from '@/composables/useScope'

const { t } = useI18n()
const { canRead, canWrite, canDelete } = useScope('user')

const isLoading = ref(true)
const users = ref<User[]>([])
const allSkills = ref<Skill[]>([])

async function loadData() {
    try {
        const [usersData, skillsData] = await Promise.all([usersService.getAll(), skillsService.getAll()])
        users.value = usersData
        allSkills.value = skillsData
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)

const showFormModal = ref(false)
const editingUser = ref<User | null>(null)
const isSubmitting = ref(false)
const formError = ref('')

const form = reactive({ name: '', email: '', phoneNumber: '', active: true, skillIds: [] as string[] })

function openCreate() {
    editingUser.value = null
    form.name = ''; form.email = ''; form.phoneNumber = ''; form.active = true; form.skillIds = []
    formError.value = ''
    showFormModal.value = true
}

function openEdit(user: User) {
    editingUser.value = user
    form.name = user.name; form.email = user.email; form.phoneNumber = user.phoneNumber
    form.active = user.active; form.skillIds = user.skills.map(s => s.id)
    formError.value = ''
    showFormModal.value = true
}

function closeForm() { showFormModal.value = false }

async function submitForm() {
    formError.value = ''
    isSubmitting.value = true
    try {
        const fields = { name: form.name, email: form.email, phoneNumber: form.phoneNumber, active: form.active }
        let savedUser: User
        if (editingUser.value) {
            savedUser = await usersService.update(editingUser.value.id, fields)
        } else {
            savedUser = await usersService.create(fields)
        }
        const withSkills = await usersService.registerSkills(savedUser.id, form.skillIds)
        const target = withSkills ?? savedUser
        if (editingUser.value) {
            const idx = users.value.findIndex(u => u.id === editingUser.value!.id)
            if (idx !== -1) users.value[idx] = target
        } else {
            users.value.push(target)
        }
        closeForm()
    } catch (err: unknown) {
        formError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

const showDeleteModal = ref(false)
const deletingUser = ref<User | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')

function confirmDelete(user: User) {
    deletingUser.value = user; deleteError.value = ''; showDeleteModal.value = true
}

async function executeDelete() {
    if (!deletingUser.value) return
    isDeleting.value = true; deleteError.value = ''
    try {
        await usersService.delete(deletingUser.value.id)
        users.value = users.value.filter(u => u.id !== deletingUser.value!.id)
        showDeleteModal.value = false
    } catch (err: unknown) {
        deleteError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isDeleting.value = false
    }
}
</script>

<style scoped>
.users-view { max-width: 1060px; margin: 0 auto; padding: 36px 24px 48px; }

.header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 32px; }
.title-group { max-width: 720px; }
h1 { margin: 0 0 8px; font-size: 2rem; }
.title-group p { margin: 0; color: #6b7280; line-height: 1.7; }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px 0; color: var(--color-text-light); }

.spinner {
    display: block; width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid var(--color-bg-contrast); border-top-color: var(--color-primary);
    animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 80px 0; color: var(--color-text-light); display: flex; flex-direction: column; align-items: center; gap: 16px; }

.users-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.user-card { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.user-card__header { display: flex; align-items: flex-start; gap: 14px; }
.user-card__info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.user-card__name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.user-card__info h3 { margin: 0; font-size: 1.05rem; }
.user-card__info small { display: block; color: #6b7280; font-size: 0.85rem; }

.status-badge { font-size: 0.7rem; font-weight: 600; padding: 2px 7px; border-radius: 999px; }
.status-badge--active   { background: var(--status-active-bg);   color: var(--status-active-color); }
.status-badge--inactive { background: var(--status-inactive-bg); color: var(--status-inactive-color); }

.user-card__skills { display: flex; flex-wrap: wrap; gap: 6px; min-height: 24px; }
.no-skills { font-size: 0.82rem; color: var(--color-text-light); font-style: italic; }
.user-card__actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }

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
.field input[type="tel"] {
    padding: 9px 12px; border: 1px solid var(--border-color); border-radius: 8px;
    font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s;
}
.field input[type="text"]:focus,
.field input[type="email"]:focus,
.field input[type="tel"]:focus { border-color: var(--color-primary); }

.field--checkbox label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500; }
.field--checkbox input[type="checkbox"] { accent-color: var(--color-primary); width: 16px; height: 16px; }

.skills-check-list { display: flex; flex-direction: column; gap: 6px; max-height: 220px; overflow-y: auto; padding: 2px; }

.skill-check {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
    padding: 6px 8px; border-radius: 8px; border: 2px solid transparent;
    transition: background 0.15s, border-color 0.15s;
}
.skill-check:hover { background: var(--color-bg); }
.skill-check--selected { border-color: var(--color-primary); background: var(--skill-check-selected-bg); }
.skill-check input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--color-primary); flex-shrink: 0; }

.skills-empty { margin: 0; color: var(--color-text-light); font-size: 0.88rem; text-align: center; padding: 8px 0; }
.form-error { margin: 0; color: #dc2626; font-size: 0.88rem; }

@media (max-width: 920px) {
    .users-grid { grid-template-columns: 1fr; }
    .header { flex-direction: column; align-items: flex-start; }
}
</style>
