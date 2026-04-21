<template>
    <section class="dashboard-view">
        <header class="dashboard-header">
            <h1>{{ t('dashboard.title') }}</h1>
            <p>{{ t('dashboard.subtitle') }}</p>
        </header>

        <div v-if="isLoading" class="loading-state">
            <span class="spinner" />
            <p>{{ t('dashboard.loading') }}</p>
        </div>

        <template v-else>
            <div class="metrics-grid">
                <Card :title="t('dashboard.total_musicians')" icon="musicians" clickable @click="router.push('/users')">
                    <p class="metric-value">{{ totalMusicians }}</p>
                    <p class="metric-caption">{{ totalMusicians }} {{ t('dashboard.active_currently') }}</p>
                </Card>

                <Card :title="t('dashboard.total_skills')" icon="music" clickable @click="router.push('/skills')">
                    <p class="metric-value">{{ totalSkills }}</p>
                    <p class="metric-caption">{{ t('dashboard.skill_categories') }}</p>
                </Card>

                <Card :title="t('dashboard.upcoming_events')" icon="home" clickable @click="router.push('/schedules')">
                    <p class="metric-value">{{ upcomingServices.length }}</p>
                    <p class="metric-caption">{{ upcomingServices.length }} {{ t('dashboard.scheduled_month') }}</p>
                </Card>
            </div>

            <div class="content-grid">
                <Card :title="t('dashboard.upcoming_services')" :subtitle="t('dashboard.next_5')">
                    <ul class="service-list">
                        <li v-if="upcomingServices.length === 0" class="service-empty">
                            {{ t('dashboard.no_services') }}
                        </li>
                        <li v-for="service in upcomingServices" :key="service.id" class="service-row"
                            @click="router.push('/schedules')">
                            <div>
                                <p class="service-title">{{ service.name }}</p>
                                <p class="service-date">{{ formatDate(service.date) }}</p>
                            </div>
                            <div class="service-meta">
                                <span class="assigned-badge">{{ service.users.length }} {{ t('dashboard.assigned') }}</span>
                                <span class="service-chevron" aria-hidden="true">&#8250;</span>
                            </div>
                        </li>
                    </ul>
                </Card>

                <Card :title="t('dashboard.musician_load')" :subtitle="t('dashboard.month_count')">
                    <div class="load-list">
                        <p v-if="musicianLoad.length === 0" class="load-empty">{{ t('dashboard.no_musicians') }}</p>
                        <article v-for="musician in musicianLoad" :key="musician.name" class="load-row">
                            <div class="load-row__top">
                                <p class="load-name">{{ musician.name }}</p>
                                <p class="load-value">{{ musician.count }} / {{ musician.max }} {{ t('dashboard.max') }}</p>
                            </div>
                            <div class="progress-track" role="progressbar" :aria-valuemin="0"
                                :aria-valuemax="musician.max" :aria-valuenow="musician.count">
                                <span class="progress-fill"
                                    :style="{ width: `${musician.max > 0 ? (musician.count / musician.max) * 100 : 0}%` }" />
                            </div>
                            <p class="load-note">
                                {{ musician.count > 0 ? t('dashboard.scheduled_note') : t('dashboard.not_scheduled') }}
                            </p>
                        </article>
                    </div>
                </Card>
            </div>
        </template>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from './components/Card.vue'
import { usersService } from '@/services/usersService'
import { skillsService } from '@/services/skillsService'
import { schedulesService } from '@/services/schedulesService'
import type { User } from '@/features/users/types/User'
import type { Skill } from '@/features/skills/types/Skill'
import type { Schedule } from '@/features/schedules/types/Schedule'

const { t, locale } = useI18n()
const router = useRouter()

const isLoading = ref(true)
const users = ref<User[]>([])
const skills = ref<Skill[]>([])
const schedules = ref<Schedule[]>([])

const MAX_PER_MONTH = 4

const now = new Date()

const totalMusicians = computed(() => users.value.filter(u => u.active).length)
const totalSkills = computed(() => skills.value.length)

const upcomingServices = computed(() =>
    schedules.value
        .filter(s => new Date(s.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
)

const musicianLoad = computed(() => {
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    return users.value.map(user => {
        const count = schedules.value.filter(s => {
            const d = new Date(s.date)
            return d.getMonth() === currentMonth
                && d.getFullYear() === currentYear
                && s.users.some(su => su.userId === user.id)
        }).length
        return { name: user.name, count, max: MAX_PER_MONTH }
    })
})

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'pt-BR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
}

onMounted(async () => {
    try {
        const [usersData, skillsData, schedulesData] = await Promise.all([
            usersService.getAll(),
            skillsService.getAll(),
            schedulesService.getAll(),
        ])
        users.value = usersData
        skills.value = skillsData
        schedules.value = schedulesData
    } catch {
        // silent — keep defaults
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
.dashboard-view {
    max-width: 1180px;
    margin: 0 auto;
    padding: 24px 8px 32px;
}

.dashboard-header { margin-bottom: 22px; }

.dashboard-header h1 {
    margin: 0 0 6px;
    font-size: 2rem;
    line-height: 1.2;
    color: var(--color-text);
}

.dashboard-header p {
    margin: 0;
    color: var(--color-text-light);
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.metric-value {
    margin: 0;
    font-size: 2rem;
    line-height: 1;
    font-weight: 700;
    color: var(--color-text);
}

.metric-caption {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-light);
}

.content-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 16px;
    align-items: stretch;
}

.service-list {
    margin: 0;
    padding: 0;
    list-style: none;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.service-empty, .load-empty {
    color: var(--color-text-light);
    font-size: 0.9rem;
    text-align: center;
    padding: 32px 0;
}

.service-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    background: var(--color-white);
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.service-row:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
}

.service-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-text);
}

.service-date {
    margin: 5px 0 0;
    color: var(--color-text-light);
    text-transform: capitalize;
}

.service-meta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
}

.assigned-badge {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--badge-text);
    background: var(--badge-bg);
    border-radius: 999px;
    padding: 5px 10px;
}

.service-chevron {
    font-size: 1.4rem;
    color: var(--color-text-light);
    line-height: 1;
}

.load-list {
    max-height: 360px;
    overflow-y: auto;
    padding-right: 4px;
}

.load-row { padding: 8px 0 14px; }
.load-row + .load-row { border-top: 1px solid var(--border-color); }

.load-row__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.load-name, .load-value, .load-note { margin: 0; }
.load-name { color: var(--color-text); font-weight: 600; }
.load-value { font-weight: 600; color: var(--color-text-light); }

.progress-track {
    margin-top: 8px;
    width: 100%;
    height: 7px;
    border-radius: 999px;
    background: var(--color-bg-contrast);
    overflow: hidden;
}

.progress-fill {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-analog-teal) 100%);
}

.load-note {
    margin-top: 6px;
    text-align: right;
    color: var(--color-text-light);
    font-size: 0.9rem;
}

@media (max-width: 980px) {
    .metrics-grid { grid-template-columns: 1fr; }
    .content-grid { grid-template-columns: 1fr; }
    .service-list { min-height: 0; }
    .load-list { max-height: none; overflow: visible; }
}
</style>
