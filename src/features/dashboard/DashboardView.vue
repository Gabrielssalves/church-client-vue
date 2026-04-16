<template>
    <section class="dashboard-view">
        <header class="dashboard-header">
            <h1>Overview</h1>
            <p>Manage your team and upcoming services.</p>
        </header>

        <div class="metrics-grid">
            <Card title="Total Musicians" icon="musicians">
                <p class="metric-value">{{ totalMusicians }}</p>
                <p class="metric-caption">{{ totalMusicians }} active currently</p>
            </Card>

            <Card title="Total Skills" icon="music">
                <p class="metric-value">{{ totalSkills }}</p>
                <p class="metric-caption">Core skill categories</p>
            </Card>

            <Card title="Upcoming Events" icon="home">
                <p class="metric-value">{{ upcomingServices.length }}</p>
                <p class="metric-caption">{{ upcomingServices.length }} scheduled this month</p>
            </Card>
        </div>

        <div class="content-grid">
            <Card title="Upcoming Services" subtitle="The next 5 scheduled events.">
                <ul class="service-list">
                    <li v-for="service in upcomingServices" :key="service.id" class="service-row">
                        <div>
                            <p class="service-title">{{ service.name }}</p>
                            <p class="service-date">{{ service.date }}</p>
                        </div>

                        <div class="service-meta">
                            <span class="assigned-badge">{{ service.assigned }} assigned</span>
                            <span class="service-chevron" aria-hidden="true">&#8250;</span>
                        </div>
                    </li>
                </ul>
            </Card>

            <Card title="Musician Load" subtitle="Service count for the current month.">
                <div class="load-list">
                    <article v-for="musician in musicianLoad" :key="musician.name" class="load-row">
                        <div class="load-row__top">
                            <p class="load-name">{{ musician.name }}</p>
                            <p class="load-value">{{ musician.count }} / {{ musician.max }} max</p>
                        </div>

                        <div class="progress-track" role="progressbar" :aria-valuemin="0" :aria-valuemax="musician.max"
                            :aria-valuenow="musician.count">
                            <span class="progress-fill"
                                :style="{ width: `${(musician.count / musician.max) * 100}%` }" />
                        </div>

                        <p class="load-note">{{ musician.count > 0 ? 'Scheduled this month' : 'Not scheduled yet' }}</p>
                    </article>
                </div>
            </Card>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Card from './components/Card.vue'

type ServiceItem = {
    id: string
    name: string
    date: string
    assigned: number
}

type MusicianLoad = {
    name: string
    count: number
    max: number
}

const upcomingServices = ref<ServiceItem[]>([
    {
        id: '1',
        name: 'Easter Sunday',
        date: 'Sunday, April 5, 2026',
        assigned: 0
    }
])

const musicianLoad = ref<MusicianLoad[]>([
    { name: 'Gabriel Alves', count: 0, max: 4 },
    { name: 'Ariel Vaccari', count: 0, max: 4 },
    { name: 'Cesar Eduardo', count: 0, max: 4 },
    { name: 'Igor Gondin', count: 0, max: 4 },
    { name: 'Mariana', count: 0, max: 4 }
])

const totalMusicians = computed(() => musicianLoad.value.length)
const totalSkills = ref(7)
</script>

<style scoped>
.dashboard-view {
    max-width: 1180px;
    margin: 0 auto;
    padding: 24px 8px 32px;
}

.dashboard-header {
    margin-bottom: 22px;
}

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
    color: #111827;
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
}

.service-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    background: #fff;
}

.service-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    color: #111827;
}

.service-date {
    margin: 5px 0 0;
    color: var(--color-text-light);
}

.service-meta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
}

.assigned-badge {
    font-size: 0.82rem;
    font-weight: 600;
    color: #4c5d90;
    background: #eef1fb;
    border-radius: 999px;
    padding: 5px 10px;
}

.service-chevron {
    font-size: 1.4rem;
    color: #7c8499;
    line-height: 1;
}

.load-list {
    max-height: 360px;
    overflow-y: auto;
    padding-right: 4px;
}

.load-row {
    padding: 8px 0 14px;
}

.load-row+.load-row {
    border-top: 1px solid #f0f2f7;
}

.load-row__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.load-name,
.load-value,
.load-note {
    margin: 0;
}

.load-name {
    color: #111827;
    font-weight: 600;
}

.load-value {
    font-weight: 600;
    color: #4b5563;
}

.progress-track {
    margin-top: 8px;
    width: 100%;
    height: 7px;
    border-radius: 999px;
    background: #dfe4ee;
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
    color: #7d8598;
    font-size: 0.9rem;
}

@media (max-width: 980px) {
    .metrics-grid {
        grid-template-columns: 1fr;
    }

    .content-grid {
        grid-template-columns: 1fr;
    }

    .service-list {
        min-height: 0;
    }

    .load-list {
        max-height: none;
        overflow: visible;
    }
}
</style>
