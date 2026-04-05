<script setup lang="ts">
import { computed } from 'vue'
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Circle,
    Home,
    LogOut,
    Music,
    Shield,
    Shuffle,
    Users
} from 'lucide-vue-next'

const props = withDefaults(
    defineProps<{
        name: string
        size?: number
        strokeWidth?: number
    }>(),
    {
        size: 18,
        strokeWidth: 2
    }
)

const iconMap = {
    home: Home,
    users: Users,
    musicians: Music,
    music: Music,
    draw: Shuffle,
    shuffle: Shuffle,
    logout: LogOut,
    'log-out': LogOut,
    chevronleft: ChevronLeft,
    'chevron-left': ChevronLeft,
    chevronright: ChevronRight,
    'chevron-right': ChevronRight,
    chevrondown: ChevronDown,
    'chevron-down': ChevronDown,
    circle: Circle,
    default: Shield
} as const

const normalizedName = computed(() => props.name.trim().toLowerCase())

const iconComponent = computed(() => {
    return iconMap[normalizedName.value as keyof typeof iconMap] ?? iconMap.default
})
</script>

<template>
    <component :is="iconComponent" :size="size" :stroke-width="strokeWidth" aria-hidden="true" />
</template>