import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'

// Stub the MainLayout so we don't need to mount the full sidebar / router-view
vi.mock('@/layouts/MainLayout.vue', () => ({
  default: { template: '<div data-testid="main-layout"><slot /></div>' },
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts without throwing', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders the MainLayout', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.find('[data-testid="main-layout"]').exists()).toBe(true)
  })
})
