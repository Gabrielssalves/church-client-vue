<script setup>
import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <div class="login-container">
    <div class="left-panel">
      <div class="blob-shape"></div>
      <div class="welcome-content">
        <h1 class="welcome-title">Welcome Back</h1>
        <p class="welcome-subtitle">We're excited to see you again. Sign in to access your account and continue your journey with us.</p>
      </div>
    </div>
    <div class="right-panel">
      <div class="login-form-wrapper">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 50vh;
  padding: 4rem 20rem 0 20rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.left-panel {
  position: relative;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-analog-teal) 100%);
  color: var(--color-white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  overflow: hidden;
  border-radius: 5p;
  border-radius: 30px 0 0 30px;
}

.left-panel::before, .left-panel::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.left-panel::before {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
}

.left-panel::after {
  width: 250px;
  height: 250px;
  bottom: -80px;
  left: -80px;
}

.blob-shape {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: blob-animation 8s ease-in-out infinite alternate;
}

@keyframes blob-animation {
  0% { 
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
    transform: translate(0, 0) rotate(0deg); 
  }
  100% { 
    border-radius: 30% 70% 70% 30% / 50% 50% 50% 50%; 
    transform: translate(20px, -20px) rotate(10deg); 
  }
}

.welcome-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
}

.right-panel {
  background: var(--color-bg-contrast);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  border-radius: 0 30px 30px 0;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
  }
  .left-panel {
    min-height: 300px;
    padding: 2rem;
  }
  .left-panel::before {
    width: 250px;
    height: 250px;
    top: -80px;
    right: -80px;
  }
  .left-panel::after {
    width: 180px;
    height: 180px;
    bottom: -60px;
    left: -60px;
  }
  .blob-shape {
    width: 200px;
    height: 200px;
  }
  .welcome-title {
    font-size: 2rem;
  }
  .right-panel {
    padding: 2rem;
  }
}
</style>