import { ref } from 'vue'

const STORAGE_KEY = 'theme'
const saved = localStorage.getItem(STORAGE_KEY)

export const isDark = ref(saved === 'dark')

function applyTheme(dark: boolean) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

applyTheme(isDark.value)

export function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
}
