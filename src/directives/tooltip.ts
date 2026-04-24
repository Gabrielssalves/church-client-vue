import type { DirectiveBinding } from 'vue'

type TooltipEl = HTMLElement & {
  _tt_enter?: () => void
  _tt_leave?: () => void
}

let current: HTMLElement | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function show(text: string, anchor: HTMLElement) {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  if (current) { current.remove(); current = null }

  const rect = anchor.getBoundingClientRect()

  const tip = document.createElement('div')
  tip.className = 'app-tooltip'
  tip.textContent = text
  document.body.appendChild(tip)

  const tipH = tip.getBoundingClientRect().height
  const top = Math.max(8, Math.min(
    rect.top + rect.height / 2 - tipH / 2,
    window.innerHeight - tipH - 8
  ))

  tip.style.left = `${rect.right + 12}px`
  tip.style.top = `${top}px`

  requestAnimationFrame(() => tip.classList.add('is-visible'))
  current = tip
}

function hide() {
  if (!current) return
  current.classList.remove('is-visible')
  const el = current
  hideTimer = setTimeout(() => { el.remove(); if (current === el) current = null }, 130)
}

function attach(el: TooltipEl, text: string) {
  el._tt_enter = () => show(text, el)
  el._tt_leave = hide
  el.addEventListener('mouseenter', el._tt_enter)
  el.addEventListener('mouseleave', el._tt_leave)
}

function detach(el: TooltipEl) {
  if (el._tt_enter) el.removeEventListener('mouseenter', el._tt_enter)
  if (el._tt_leave) el.removeEventListener('mouseleave', el._tt_leave)
  delete el._tt_enter
  delete el._tt_leave
}

export const vTooltip = {
  mounted(el: TooltipEl, binding: DirectiveBinding<string | undefined>) {
    if (binding.value) attach(el, binding.value)
  },

  updated(el: TooltipEl, binding: DirectiveBinding<string | undefined>) {
    if (binding.value === binding.oldValue) return
    detach(el)
    hide()
    if (binding.value) attach(el, binding.value)
  },

  unmounted(el: TooltipEl) {
    detach(el)
    hide()
  },
}
