<template>
    <section class="schedules-view">
        <div class="header">
            <div class="title-group">
                <h1>{{ t('schedules.title') }}</h1>
                <p>{{ t('schedules.subtitle') }}</p>
            </div>
            <div class="header-actions">
                <BaseButton variant="secondary" size="lg" @click="openCreate">{{ t('schedules.create_manual') }}</BaseButton>
                <BaseButton variant="primary" size="lg" @click="openGenerate">{{ t('schedules.generate_auto') }}</BaseButton>
            </div>
        </div>

        <div v-if="isLoading" class="loading-state">
            <span class="spinner" />
            <p>{{ t('schedules.loading') }}</p>
        </div>

        <div v-else-if="schedules.length === 0" class="empty-state">
            <p>{{ t('schedules.empty') }}</p>
            <div class="empty-actions">
                <BaseButton variant="secondary" @click="openCreate">{{ t('schedules.create_first_manual') }}</BaseButton>
                <BaseButton variant="primary" @click="openGenerate">{{ t('schedules.create_first_auto') }}</BaseButton>
            </div>
        </div>

        <div v-else class="schedules-list">
            <BaseCard v-for="schedule in sortedSchedules" :key="schedule.id" class="schedule-card">
                <div class="schedule-card__body">
                    <div class="schedule-icon">
                        <AppIcon name="calendar" :size="20" />
                    </div>
                    <div class="schedule-info">
                        <h3>{{ schedule.name }}</h3>
                        <p class="schedule-date">{{ formatDate(schedule.date) }}</p>
                    </div>
                    <div class="schedule-card__meta-actions">
                        <span class="assigned-pill">{{ schedule.users.length }} {{ t('schedules.musicians_count') }}</span>
                        <BaseButton variant="secondary" size="sm" @click="openEdit(schedule)">{{ t('common.edit') }}</BaseButton>
                        <BaseButton variant="danger" size="sm" @click="confirmDelete(schedule)">{{ t('common.delete') }}</BaseButton>
                    </div>
                </div>

                <div class="schedule-card__users">
                    <div v-for="su in schedule.users" :key="su.id" class="schedule-user-row">
                        <BaseAvatar :name="getUserName(su.userId)" :size="28" />
                        <span class="user-name">{{ getUserName(su.userId) }}</span>
                        <BaseBadge :color="getSkillColor(su.skillId)">{{ getSkillName(su.skillId) }}</BaseBadge>
                        <button class="remove-user-btn" :title="t('common.remove')" @click="removeUser(schedule, su.id)">×</button>
                    </div>

                    <button class="add-user-btn" @click="openAddUser(schedule)">
                        <span>+</span> {{ t('schedules.add_musician_btn') }}
                    </button>
                </div>
            </BaseCard>
        </div>

        <!-- Create Manual Modal -->
        <Teleport to="body">
            <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
                <div class="modal modal--sm">
                    <div class="modal__header">
                        <h2>{{ t('schedules.new_title') }}</h2>
                        <button class="modal__close" @click="showCreateModal = false">&times;</button>
                    </div>
                    <form class="modal__body" @submit.prevent="submitCreate">
                        <div class="field">
                            <label>{{ t('common.name') }}</label>
                            <input v-model="createForm.name" type="text" :placeholder="t('schedules.name_placeholder')" required />
                        </div>
                        <div class="field">
                            <label>{{ t('schedules.date_label') }}</label>
                            <input v-model="createForm.date" type="date" required />
                        </div>
                        <p v-if="createError" class="form-error">{{ createError }}</p>
                        <div class="modal__footer">
                            <BaseButton variant="secondary" type="button" @click="showCreateModal = false">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="primary" type="submit" :loading="isSubmitting">{{ t('common.create') }}</BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Edit Modal -->
        <Teleport to="body">
            <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
                <div class="modal modal--sm">
                    <div class="modal__header">
                        <h2>{{ t('schedules.edit_title') }}</h2>
                        <button class="modal__close" @click="showEditModal = false">&times;</button>
                    </div>
                    <form class="modal__body" @submit.prevent="submitEdit">
                        <div class="field">
                            <label>{{ t('common.name') }}</label>
                            <input v-model="editForm.name" type="text" required />
                        </div>
                        <div class="field">
                            <label>{{ t('schedules.date_label') }}</label>
                            <input v-model="editForm.date" type="date" required />
                        </div>
                        <p v-if="editError" class="form-error">{{ editError }}</p>
                        <div class="modal__footer">
                            <BaseButton variant="secondary" type="button" @click="showEditModal = false">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="primary" type="submit" :loading="isSubmitting">{{ t('common.save') }}</BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Add User Modal -->
        <Teleport to="body">
            <div v-if="showAddUserModal" class="modal-overlay" @click.self="showAddUserModal = false">
                <div class="modal modal--sm">
                    <div class="modal__header">
                        <h2>{{ t('schedules.add_musician_title') }}</h2>
                        <button class="modal__close" @click="showAddUserModal = false">&times;</button>
                    </div>
                    <div class="modal__body">
                        <div class="field">
                            <label>{{ t('schedules.musician_label') }}</label>
                            <select v-model="addUserForm.userId" required class="field-select">
                                <option value="" disabled>{{ t('schedules.select_musician') }}</option>
                                <option v-for="user in allUsers" :key="user.id" :value="user.id">
                                    {{ user.name }}
                                </option>
                            </select>
                        </div>
                        <div class="field">
                            <label>{{ t('common.skill') }}</label>
                            <select v-model="addUserForm.skillId" required class="field-select">
                                <option value="" disabled>{{ t('schedules.select_skill') }}</option>
                                <option v-for="skill in availableSkillsForUser" :key="skill.id" :value="skill.id">
                                    {{ skill.name }}
                                </option>
                            </select>
                        </div>
                        <p v-if="addUserError" class="form-error">{{ addUserError }}</p>
                        <div class="modal__footer">
                            <BaseButton variant="secondary" type="button" @click="showAddUserModal = false">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="primary" :loading="isSubmitting" @click="submitAddUser">{{ t('common.add') }}</BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Delete Confirm Modal -->
        <Teleport to="body">
            <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
                <div class="modal modal--sm">
                    <div class="modal__header">
                        <h2>{{ t('common.confirm_delete') }}</h2>
                        <button class="modal__close" @click="showDeleteModal = false">&times;</button>
                    </div>
                    <div class="modal__body">
                        <p>{{ t('schedules.confirm_delete_msg', { name: deletingSchedule?.name }) }}</p>
                        <p v-if="deleteError" class="form-error">{{ deleteError }}</p>
                        <div class="modal__footer">
                            <BaseButton variant="secondary" @click="showDeleteModal = false">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="danger" :loading="isDeleting" @click="executeDelete">{{ t('common.delete') }}</BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Generate Modal -->
        <Teleport to="body">
            <div v-if="showGenerateModal" class="modal-overlay" @click.self="closeGenerate">
                <div class="modal modal--lg">
                    <div class="modal__header">
                        <h2>{{ t('schedules.generate_title') }}</h2>
                        <button class="modal__close" @click="closeGenerate">&times;</button>
                    </div>
                    <form class="modal__body" @submit.prevent="submitGenerate">
                        <div class="fields-row">
                            <div class="field">
                                <label>{{ t('schedules.start_date') }}</label>
                                <input v-model="genForm.startDate" type="date" required />
                            </div>
                            <div class="field">
                                <label>{{ t('schedules.end_date') }}</label>
                                <input v-model="genForm.endDate" type="date" required />
                            </div>
                        </div>

                        <div class="field">
                            <label>{{ t('schedules.days_of_week') }}</label>
                            <div class="days-grid">
                                <label v-for="day in DAYS_OF_WEEK" :key="day" class="day-check">
                                    <input type="checkbox" :value="day" v-model="genForm.daysOfWeek" />
                                    {{ t(`days.${day}`) }}
                                </label>
                            </div>
                        </div>

                        <div class="field">
                            <div class="skill-configs-header">
                                <label>{{ t('schedules.skill_config') }}</label>
                                <button type="button" class="add-skill-btn" @click="addSkillConfig">{{ t('schedules.add_config') }}</button>
                            </div>
                            <div class="skill-configs-list">
                                <div v-for="(config, idx) in genForm.skillConfigs" :key="idx" class="skill-config-row">
                                    <select v-model="config.skillId" required class="skill-select">
                                        <option value="" disabled>{{ t('schedules.select_skill') }}</option>
                                        <option v-for="skill in allSkills" :key="skill.id" :value="skill.id">
                                            {{ skill.name }}
                                        </option>
                                    </select>
                                    <div class="skill-config-fields">
                                        <div class="field field--inline">
                                            <label>{{ t('schedules.priority') }}</label>
                                            <input v-model.number="config.priority" type="number" min="1" required />
                                        </div>
                                        <div class="field field--inline">
                                            <label>{{ t('schedules.rest_days') }}</label>
                                            <input v-model.number="config.minimunRestDays" type="number" min="0" required />
                                        </div>
                                    </div>
                                    <button type="button" class="remove-config-btn" @click="removeSkillConfig(idx)">×</button>
                                </div>
                                <p v-if="genForm.skillConfigs.length === 0" class="configs-empty">
                                    {{ t('schedules.no_configs') }}
                                </p>
                            </div>
                        </div>

                        <p v-if="generateError" class="form-error">{{ generateError }}</p>
                        <p v-if="generateSuccess" class="form-success">{{ generateSuccess }}</p>

                        <div class="modal__footer">
                            <BaseButton variant="secondary" type="button" @click="closeGenerate">{{ t('common.cancel') }}</BaseButton>
                            <BaseButton variant="primary" type="submit" :loading="isGenerating">{{ t('schedules.generate_btn') }}</BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import BaseAvatar from '@/components/BaseAvatar.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { schedulesService } from '@/services/schedulesService'
import { skillsService } from '@/services/skillsService'
import { usersService } from '@/services/usersService'
import type { Schedule, SkillConfig } from '@/features/schedules/types/Schedule'
import type { Skill } from '@/features/skills/types/Skill'
import type { User } from '@/features/users/types/User'

const { t, locale } = useI18n()

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const isLoading = ref(true)
const schedules = ref<Schedule[]>([])
const allSkills = ref<Skill[]>([])
const allUsers = ref<User[]>([])

const sortedSchedules = computed(() =>
    [...schedules.value].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
)

function getUserName(userId: string): string {
    return allUsers.value.find(u => u.id === userId)?.name ?? '—'
}

function getSkillName(skillId: string): string {
    return allSkills.value.find(s => s.id === skillId)?.name ?? '—'
}

function getSkillColor(skillId: string) {
    return allSkills.value.find(s => s.id === skillId)?.color ?? 'gray'
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
}

function isoDate(dateStr: string): string {
    return new Date(dateStr).toISOString().slice(0, 10)
}

async function loadData() {
    try {
        const [schedulesData, skillsData, usersData] = await Promise.all([
            schedulesService.getAll(),
            skillsService.getAll(),
            usersService.getAll(),
        ])
        schedules.value = schedulesData
        allSkills.value = skillsData
        allUsers.value = usersData
    } finally {
        isLoading.value = false
    }
}

onMounted(loadData)

// ---- Create manual ----
const showCreateModal = ref(false)
const isSubmitting = ref(false)
const createError = ref('')
const createForm = reactive({ name: '', date: '' })

function openCreate() {
    createForm.name = ''
    createForm.date = ''
    createError.value = ''
    showCreateModal.value = true
}

async function submitCreate() {
    createError.value = ''
    isSubmitting.value = true
    try {
        const created = await schedulesService.create({ name: createForm.name, date: createForm.date })
        schedules.value.push(created)
        showCreateModal.value = false
    } catch (err: unknown) {
        createError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

// ---- Edit ----
const showEditModal = ref(false)
const editingSchedule = ref<Schedule | null>(null)
const editError = ref('')
const editForm = reactive({ name: '', date: '' })

function openEdit(schedule: Schedule) {
    editingSchedule.value = schedule
    editForm.name = schedule.name
    editForm.date = isoDate(schedule.date)
    editError.value = ''
    showEditModal.value = true
}

async function submitEdit() {
    if (!editingSchedule.value) return
    editError.value = ''
    isSubmitting.value = true
    try {
        const updated = await schedulesService.update(editingSchedule.value.id, { name: editForm.name, date: editForm.date })
        const idx = schedules.value.findIndex(s => s.id === editingSchedule.value!.id)
        if (idx !== -1) schedules.value[idx] = updated
        showEditModal.value = false
    } catch (err: unknown) {
        editError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

// ---- Delete ----
const showDeleteModal = ref(false)
const deletingSchedule = ref<Schedule | null>(null)
const isDeleting = ref(false)
const deleteError = ref('')

function confirmDelete(schedule: Schedule) {
    deletingSchedule.value = schedule
    deleteError.value = ''
    showDeleteModal.value = true
}

async function executeDelete() {
    if (!deletingSchedule.value) return
    isDeleting.value = true
    deleteError.value = ''
    try {
        await schedulesService.delete(deletingSchedule.value.id)
        schedules.value = schedules.value.filter(s => s.id !== deletingSchedule.value!.id)
        showDeleteModal.value = false
    } catch (err: unknown) {
        deleteError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isDeleting.value = false
    }
}

// ---- Add user ----
const showAddUserModal = ref(false)
const addUserTargetSchedule = ref<Schedule | null>(null)
const addUserError = ref('')
const addUserForm = reactive({ userId: '', skillId: '' })

const availableSkillsForUser = computed(() => {
    if (!addUserForm.userId) return allSkills.value
    const user = allUsers.value.find(u => u.id === addUserForm.userId)
    if (!user || user.skills.length === 0) return allSkills.value
    return user.skills.map(us => allSkills.value.find(s => s.id === us.id)).filter(Boolean) as Skill[]
})

watch(() => addUserForm.userId, () => {
    addUserForm.skillId = ''
})

function openAddUser(schedule: Schedule) {
    addUserTargetSchedule.value = schedule
    addUserForm.userId = ''
    addUserForm.skillId = ''
    addUserError.value = ''
    showAddUserModal.value = true
}

async function submitAddUser() {
    if (!addUserTargetSchedule.value || !addUserForm.userId || !addUserForm.skillId) {
        addUserError.value = t('schedules.err_select_musician_skill')
        return
    }
    addUserError.value = ''
    isSubmitting.value = true
    try {
        const updated = await schedulesService.addUser(
            addUserTargetSchedule.value.id,
            addUserForm.userId,
            addUserForm.skillId,
        )
        const idx = schedules.value.findIndex(s => s.id === addUserTargetSchedule.value!.id)
        if (idx !== -1) schedules.value[idx] = updated
        showAddUserModal.value = false
    } catch (err: unknown) {
        addUserError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isSubmitting.value = false
    }
}

async function removeUser(schedule: Schedule, scheduleUserId: string) {
    try {
        const updated = await schedulesService.removeUser(schedule.id, scheduleUserId)
        const idx = schedules.value.findIndex(s => s.id === schedule.id)
        if (idx !== -1) schedules.value[idx] = updated
    } catch {
        // silent
    }
}

// ---- Generate ----
const showGenerateModal = ref(false)
const isGenerating = ref(false)
const generateError = ref('')
const generateSuccess = ref('')

const genForm = reactive<{
    startDate: string
    endDate: string
    daysOfWeek: string[]
    skillConfigs: SkillConfig[]
}>({ startDate: '', endDate: '', daysOfWeek: [], skillConfigs: [] })

function openGenerate() {
    genForm.startDate = ''
    genForm.endDate = ''
    genForm.daysOfWeek = []
    genForm.skillConfigs = []
    generateError.value = ''
    generateSuccess.value = ''
    showGenerateModal.value = true
}

function closeGenerate() { showGenerateModal.value = false }

function addSkillConfig() {
    genForm.skillConfigs.push({ skillId: '', priority: 1, minimunRestDays: 7 })
}

function removeSkillConfig(idx: number) {
    genForm.skillConfigs.splice(idx, 1)
}

async function submitGenerate() {
    generateError.value = ''
    generateSuccess.value = ''
    if (genForm.daysOfWeek.length === 0) { generateError.value = t('schedules.err_select_day'); return }
    if (genForm.skillConfigs.length === 0) { generateError.value = t('schedules.err_add_skill_config'); return }

    isGenerating.value = true
    try {
        await schedulesService.generate({
            startDate: genForm.startDate,
            endDate: genForm.endDate,
            daysOfWeek: genForm.daysOfWeek,
            skillConfigs: genForm.skillConfigs,
        })
        generateSuccess.value = t('schedules.generate_success')
        schedules.value = await schedulesService.getAll()
        setTimeout(closeGenerate, 1200)
    } catch (err: unknown) {
        generateError.value = (err as { message?: string })?.message ?? t('common.error')
    } finally {
        isGenerating.value = false
    }
}
</script>

<style scoped>
.schedules-view {
    max-width: 1060px;
    margin: 0 auto;
    padding: 36px 24px 48px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 32px;
}

.header-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
}

.title-group {
    max-width: 720px;
}

h1 {
    margin: 0 0 8px;
    font-size: 2rem;
}

.title-group p {
    margin: 0;
    color: #6b7280;
    line-height: 1.7;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 80px 0;
    color: var(--color-text-light);
}

.spinner {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid var(--color-bg-contrast);
    border-top-color: var(--color-primary);
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
    text-align: center;
    padding: 80px 0;
    color: var(--color-text-light);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.empty-actions {
    display: flex;
    gap: 10px;
}

.schedules-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.schedule-card {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.schedule-card__body {
    display: flex;
    align-items: center;
    gap: 14px;
}

.schedule-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--icon-bg);
    color: var(--icon-color);
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.schedule-info {
    flex: 1;
}

.schedule-info h3 {
    margin: 0 0 4px;
    font-size: 1.05rem;
}

.schedule-date {
    margin: 0;
    color: var(--color-text-light);
    font-size: 0.9rem;
    text-transform: capitalize;
}

.schedule-card__meta-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.assigned-pill {
    font-size: 0.82rem;
    font-weight: 600;
    color: #4c5d90;
    background: #eef1fb;
    border-radius: 999px;
    padding: 5px 12px;
    white-space: nowrap;
}

.schedule-card__users {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border-color);
}

.schedule-user-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-name {
    font-size: 0.9rem;
    color: var(--color-text);
    flex: 1;
}

.remove-user-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    font-size: 1.2rem;
    line-height: 1;
    padding: 2px 6px;
    border-radius: 4px;
    transition: color 0.15s, background 0.15s;
}

.remove-user-btn:hover {
    color: #dc2626;
    background: #fee2e2;
}

.add-user-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    background: none;
    border: 1px dashed var(--color-primary);
    color: var(--color-primary);
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    width: fit-content;
    transition: background 0.15s;
}

.add-user-btn:hover {
    background: #f0fdf4;
}

/* Modals */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
    overflow-y: auto;
}

.modal {
    background: var(--color-white);
    border-radius: 14px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
    margin: auto;
}

.modal--sm { max-width: 400px; }
.modal--lg { max-width: 640px; }

.modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 0;
}

.modal__header h2 {
    margin: 0;
    font-size: 1.2rem;
}

.modal__close {
    background: none;
    border: none;
    font-size: 1.6rem;
    cursor: pointer;
    color: var(--color-text-light);
    line-height: 1;
    padding: 0 4px;
}

.modal__close:hover { color: var(--color-text); }

.modal__body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 4px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
}

.field input[type="text"],
.field input[type="date"],
.field input[type="number"],
.field-select,
.skill-select {
    padding: 9px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    background: var(--color-white);
    transition: border-color 0.2s;
    width: 100%;
    box-sizing: border-box;
}

.field input:focus,
.field-select:focus,
.skill-select:focus {
    border-color: var(--color-primary);
}

.fields-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

.days-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

.day-check {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 0.88rem;
}

.day-check input[type="checkbox"] { accent-color: var(--color-primary); }

.skill-configs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.skill-configs-header label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
}

.add-skill-btn {
    background: none;
    border: 1px dashed var(--color-primary);
    color: var(--color-primary);
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
}

.add-skill-btn:hover { background: #dcfce7; }

.skill-configs-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
}

.skill-config-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    flex-wrap: wrap;
}

.skill-select { flex: 1; min-width: 140px; }

.skill-config-fields {
    display: flex;
    gap: 10px;
}

.field--inline {
    flex-direction: column;
    gap: 4px;
}

.field--inline input { width: 80px; }

.remove-config-btn {
    background: #fee2e2;
    border: none;
    border-radius: 6px;
    color: #dc2626;
    font-size: 1.2rem;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    align-self: flex-end;
}

.remove-config-btn:hover { background: #fecaca; }

.configs-empty {
    color: var(--color-text-light);
    font-size: 0.9rem;
    text-align: center;
    padding: 12px 0;
    margin: 0;
}

.form-error {
    margin: 0;
    color: #dc2626;
    font-size: 0.88rem;
}

.form-success {
    margin: 0;
    color: #16a34a;
    font-size: 0.88rem;
    font-weight: 600;
}

@media (max-width: 920px) {
    .header { flex-direction: column; align-items: flex-start; }
    .fields-row { grid-template-columns: 1fr; }
    .days-grid { grid-template-columns: repeat(3, 1fr); }
    .schedule-card__meta-actions { flex-wrap: wrap; }
}
</style>
