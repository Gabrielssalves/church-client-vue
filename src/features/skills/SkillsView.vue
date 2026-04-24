<template>
    <section class="skills-view">
        <div class="header">
            <div class="title-group">
                <h1>{{ t('skills.title') }}</h1>
                <p>{{ t('skills.subtitle') }}</p>
            </div>
            <BaseButton v-if="canWrite" variant="primary" size="lg" @click="openCreate">{{ t('skills.add') }}</BaseButton>
        </div>

        <div v-if="isLoading" class="loading-state">
            <span class="spinner" />
            <p>{{ t('skills.loading') }}</p>
        </div>

        <div v-else-if="canRead && skills.length === 0" class="empty-state">
            <p>{{ t('skills.empty') }}</p>
            <BaseButton v-if="canWrite" variant="primary" @click="openCreate">{{ t('skills.add_first') }}</BaseButton>
        </div>

        <div v-else-if="canRead" class="skills-grid">
            <BaseCard v-for="skill in skills" :key="skill.id" class="skill-card">
                <div class="skill-card__body">
                    <span class="skill-dot" :style="dotStyle(skill.color)" />
                    <h3>{{ skill.name }}</h3>
                    <BaseBadge :color="skill.color" class="skill-preview-badge">{{ t(`colors.${skill.color}`) }}</BaseBadge>
                </div>
                <div v-if="canWrite || canDelete" class="skill-card__actions">
                    <BaseButton v-if="canWrite" variant="secondary" size="sm" @click="openEdit(skill)">{{ t('common.edit') }}</BaseButton>
                    <BaseButton v-if="canDelete" variant="danger" size="sm" @click="confirmDelete(skill)">{{ t('common.delete') }}</BaseButton>
                </div>
            </BaseCard>
        </div>

        <!-- Create / Edit Modal -->
        <Teleport to="body">
            <div v-if="showFormModal" class="modal-overlay" @click.self="closeForm">
                <div class="modal">
                    <div class="modal__header">
                        <h2>{{ editingSkill ? t('skills.edit_title') : t('skills.new_title') }}</h2>
                        <button class="modal__close" @click="closeForm" :aria-label="t('common.close')">&times;</button>
                    </div>
                    <form class="modal__body" @submit.prevent="submitForm">
                        <div class="field">
                            <label>{{ t('common.name') }}</label>
                            <input v-model="formName" type="text" :placeholder="t('skills.name_placeholder')" required />
                        </div>

                        <div class="field">
                            <label>{{ t('skills.color_label') }}</label>
                            <div class="color-picker">
                                <button v-for="c in SKILL_COLORS" :key="c" type="button" class="color-btn"
                                    :class="{ 'color-btn--selected': formColor === c }"
                                    :title="t(`colors.${c}`)" @click="formColor = c">
                                    <BaseBadge :color="c">{{ t(`colors.${c}`) }}</BaseBadge>
                                </button>
                            </div>
                        </div>

                        <div class="field">
                            <label>{{ t('skills.preview_label') }}</label>
                            <BaseBadge :color="formColor" class="preview-badge">
                                {{ formName || t('skills.preview_default') }}
                            </BaseBadge>
                        </div>

                        <p v-if="formError" class="form-error">{{ formError }}</p>
                        <div class="modal__footer">
                            <BaseButton variant="secondary" type="button" @click="closeForm">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="primary" type="submit" :loading="isSubmitting">
                                {{ editingSkill ? t('common.save') : t('common.create') }}
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
                        <p>{{ t('skills.confirm_delete_msg', { name: deletingSkill?.name }) }}</p>
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
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import { skillsService } from '@/services/skillsService'
import { SKILL_COLORS, type Skill, type SkillColor } from '@/features/skills/types/Skill'
import { useScope } from '@/composables/useScope'

const { t } = useI18n()
const { canRead, canWrite, canDelete } = useScope('skills')

const isLoading = ref(true)
const skills = ref<Skill[]>([])

async function loadSkills() {
    try { skills.value = await skillsService.getAll() }
    finally { isLoading.value = false }
}

onMounted(loadSkills)

const DOT_COLORS: Record<SkillColor, string> = {
    green: '#16a34a', teal: '#0f766e', blue: '#2563eb', indigo: '#4338ca',
    purple: '#9333ea', pink: '#db2777', red: '#dc2626', orange: '#ea580c',
    yellow: '#ca8a04', lime: '#65a30d', cyan: '#0891b2', gray: '#4b5563',
}

function dotStyle(color: SkillColor) {
    return { background: DOT_COLORS[color] ?? DOT_COLORS.gray }
}

const showFormModal = ref(false)
const editingSkill = ref<Skill | null>(null)
const formName = ref('')
const formColor = ref<SkillColor>('green')
const formError = ref('')
const isSubmitting = ref(false)

function openCreate() {
    editingSkill.value = null; formName.value = ''; formColor.value = 'green'
    formError.value = ''; showFormModal.value = true
}

function openEdit(skill: Skill) {
    editingSkill.value = skill; formName.value = skill.name; formColor.value = skill.color
    formError.value = ''; showFormModal.value = true
}

function closeForm() { showFormModal.value = false }

async function submitForm() {
    formError.value = ''; isSubmitting.value = true
    try {
        if (editingSkill.value) {
            const updated = await skillsService.update(editingSkill.value.id, { name: formName.value, color: formColor.value })
            const idx = skills.value.findIndex(s => s.id === editingSkill.value!.id)
            if (idx !== -1) skills.value[idx] = updated
        } else {
            skills.value.push(await skillsService.create({ name: formName.value, color: formColor.value }))
        }
        closeForm()
    } catch (err: unknown) {
        formError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

const showDeleteModal = ref(false)
const deletingSkill = ref<Skill | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')

function confirmDelete(skill: Skill) {
    deletingSkill.value = skill; deleteError.value = ''; showDeleteModal.value = true
}

async function executeDelete() {
    if (!deletingSkill.value) return
    isDeleting.value = true; deleteError.value = ''
    try {
        await skillsService.delete(deletingSkill.value.id)
        skills.value = skills.value.filter(s => s.id !== deletingSkill.value!.id)
        showDeleteModal.value = false
    } catch (err: unknown) {
        deleteError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isDeleting.value = false
    }
}
</script>

<style scoped>
.skills-view { max-width: 1060px; margin: 0 auto; padding: 36px 24px 48px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 32px; }
.title-group { max-width: 720px; }
h1 { margin: 0 0 8px; font-size: 2rem; }
.title-group p { margin: 0; color: #6b7280; line-height: 1.7; }

.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px 0; color: var(--color-text-light); }
.spinner { display: block; width: 32px; height: 32px; border-radius: 50%; border: 3px solid var(--color-bg-contrast); border-top-color: var(--color-primary); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 80px 0; color: var(--color-text-light); display: flex; flex-direction: column; align-items: center; gap: 16px; }
.skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

.skill-card { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.skill-card__body { display: flex; align-items: center; gap: 10px; }
.skill-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.skill-card__body h3 { margin: 0; font-size: 1.05rem; flex: 1; }
.skill-preview-badge { font-size: 0.75rem; }
.skill-card__actions { display: flex; gap: 8px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
.modal { background: var(--color-white); border-radius: 14px; width: 100%; max-width: 520px; box-shadow: 0 20px 60px rgba(0,0,0,0.18); }
.modal--sm { max-width: 380px; }
.modal__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
.modal__header h2 { margin: 0; font-size: 1.2rem; }
.modal__close { background: none; border: none; font-size: 1.6rem; cursor: pointer; color: var(--color-text-light); line-height: 1; padding: 0 4px; }
.modal__close:hover { color: var(--color-text); }
.modal__body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.modal__footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }

.field { display: flex; flex-direction: column; gap: 8px; }
.field label { font-size: 0.9rem; font-weight: 600; color: var(--color-text); }
.field input[type="text"] { padding: 9px 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
.field input:focus { border-color: var(--color-primary); }

.color-picker { display: flex; flex-wrap: wrap; gap: 8px; }
.color-btn { background: none; border: 2px solid transparent; border-radius: 999px; padding: 0; cursor: pointer; transition: border-color 0.15s, transform 0.1s; }
.color-btn:hover { transform: scale(1.05); }
.color-btn--selected { border-color: var(--color-text); }
.preview-badge { font-size: 0.9rem; }
.form-error { margin: 0; color: #dc2626; font-size: 0.88rem; }

@media (max-width: 920px) { .skills-grid { grid-template-columns: repeat(2, 1fr); } .header { flex-direction: column; align-items: flex-start; } }
@media (max-width: 600px) { .skills-grid { grid-template-columns: 1fr; } }
</style>
