<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import Logo from './Logo.vue'
import GoogleLoginButton from './GoogleLoginButton.vue'
import type { LoginCredentials } from '@/types/auth'

const { t } = useI18n()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const router = useRouter()

const { login, isLoading, error } = useAuth()

async function handleLogin(): Promise<void> {
  const credentials: LoginCredentials = {
    email: email.value,
    password: password.value,
  }

  try {
    await login(credentials)
    await router.replace({ name: 'Dashboard' })
  } catch {
    // error is already set on the store via useAuth — rendered below
  }
}
</script>

<template>
  <div class="login-form-container">
    <Logo />
    <h2 class="form-title">{{ t('login.title') }}</h2>
    <p class="form-subtitle">{{ t('login.subtitle') }}</p>

    <form @submit.prevent="handleLogin" novalidate>
      <div class="form-group">
        <label class="form-label" for="login-email">{{ t('login.email') }}</label>
        <input
          class="form-input"
          type="email"
          id="login-email"
          v-model="email"
          :placeholder="t('login.email_placeholder')"
          autocomplete="email"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="login-password">{{ t('login.password') }}</label>
        <input
          class="form-input"
          type="password"
          id="login-password"
          v-model="password"
          :placeholder="t('login.password_placeholder')"
          autocomplete="current-password"
          required
        />
      </div>

      <div class="form-options">
        <div class="checkbox-group">
          <input type="checkbox" id="remember-me" v-model="rememberMe" />
          <label class="checkbox-label" for="remember-me">{{ t('login.remember') }}</label>
        </div>
        <a href="#" class="forgot-password">{{ t('login.forgot') }}</a>
      </div>

      <button type="submit" class="btn-primary" :disabled="isLoading">
        <span v-if="!isLoading">{{ t('login.submit') }}</span>
        <span v-else class="button-spinner" aria-hidden="true"></span>
      </button>
    </form>

    <p v-if="error" role="alert" class="form-error">{{ error.message }}</p>

    <div class="divider" aria-hidden="true">
      <span class="divider-text">{{ t('login.or_with') }}</span>
    </div>

    <GoogleLoginButton class="btn-google" />
  </div>
</template>

<style scoped>
.login-form-container {
  width: 100%;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.form-subtitle {
  color: #4A5568;
  margin-bottom: 2rem;
  margin-top: 0;
}

form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 5px rgba(14, 133, 58, 0.1);
}

.form-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  color: #4A5568;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
}

.forgot-password {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: auto;
  transition: text-decoration 0.2s ease;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  margin-bottom: 2rem;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.button-spinner {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: rgba(255, 255, 255, 0.95);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #E2E8F0;
}

.divider-text {
  padding: 0 1rem;
  color: #718096;
  font-size: 0.875rem;
  white-space: nowrap;
}

.form-error {
  color: #dc2626;
  font-size: 0.95rem;
  margin: 0 0 1rem;
}

.btn-google {
  position: relative;
  margin-bottom: 2.25rem;
}
</style>
