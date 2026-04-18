import { createI18n } from 'vue-i18n'
import ptBR from '@/locales/pt-BR'
import en from '@/locales/en'

const STORAGE_KEY = 'locale'
const DEFAULT_LOCALE = 'pt-BR'

const saved = localStorage.getItem(STORAGE_KEY)
const locale = saved === 'en' || saved === 'pt-BR' ? saved : DEFAULT_LOCALE

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'pt-BR',
  messages: { 'pt-BR': ptBR, en },
})

export function toggleLocale() {
  const current = i18n.global.locale.value
  const next = current === 'pt-BR' ? 'en' : 'pt-BR'
  i18n.global.locale.value = next
  localStorage.setItem(STORAGE_KEY, next)
}
