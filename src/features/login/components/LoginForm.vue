<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import Logo from './Logo.vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const router = useRouter()

const { login, loading, error } = useAuth()

async function handleLogin() {
  try {
    await login({
      email: email.value,
      password: password.value
    })

    router.push('/home')
  } catch {}
}

function handleSocialLogin(provider) {
  // TODO: implement social login
  console.log('Social login:', provider)
}
</script>

<template>
  <div class="login-form-container">
    <Logo />
    <h2 class="form-title">Login</h2>
    <p class="form-subtitle">Enter your credentials to access your account</p>
    
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label class="form-label" for="email">Email Address</label>
        <input 
          class="form-input" 
          type="email" 
          id="email" 
          v-model="email"
          placeholder="you@example.com" 
          required 
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <input 
          class="form-input" 
          type="password" 
          id="password" 
          v-model="password"
          placeholder="••••••••" 
          required 
        />
      </div>

      <div class="form-options">
        <div class="checkbox-group">
          <input type="checkbox" id="remember-me" v-model="rememberMe" />
          <label class="checkbox-label" for="remember-me">Remember me</label>
        </div>
        <a href="#" class="forgot-password">Forgot password?</a>
      </div>

      <button type="submit" class="btn-primary">Login</button>
    </form>

    <div class="divider">
      <span class="divider-text">or continue with</span>
    </div>

    <button class="btn-social" @click="handleSocialLogin('google')">
      <span class="social-icon">G</span>
      Continue with Google
    </button>
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
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(20, 167, 74, 0.1);
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
  transition: background-color 0.2s ease;
  margin-bottom: 2rem;
  font-family: inherit;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 1.5rem;
}

.divider::before, .divider::after {
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
}

.btn-social:hover {
  border-color: var(--color-primary);
  background: rgba(20, 167, 74, 0.02);
}

.social-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  background: #EA4335;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>