<script setup>
defineProps({
  provider: {
    type: String,
    default: 'google',
    validator: (value) => ['google', 'github', 'microsoft'].includes(value)
  }
})

defineEmits(['click'])

const providerConfig = {
  google: {
    name: 'Google',
    icon: 'G',
    bgColor: '#EA4335'
  },
  github: {
    name: 'GitHub',
    icon: '⚙',
    bgColor: '#333333'
  },
  microsoft: {
    name: 'Microsoft',
    icon: 'M',
    bgColor: '#0078D4'
  }
}
</script>

<template>
  <button class="btn-social" @click="$emit('click', provider)">
    <span class="social-icon" :style="{ background: providerConfig[provider].bgColor }">
      {{ providerConfig[provider].icon }}
    </span>
    Continue with {{ providerConfig[provider].name }}
  </button>
</template>

<style scoped>
.btn-social {
  width: 100%;
  padding: 0.875rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  font-family: inherit;
  border: none;
  margin-bottom: 0.5rem;
}

.btn-social:hover {
  border-color: var(--color-primary);
  background: rgba(20, 167, 74, 0.02);
  border: 1px solid var(--color-primary);
}

.social-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>