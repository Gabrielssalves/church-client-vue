<script setup>
import BigImage from '../components/BigImage.vue';
import { ref } from 'vue'
const text = ref('Working   on   it...   Stay   tuned!')
</script>

<template>
    <div class="home-container">
        <BigImage />
        <h1 class="dancing-text">
        <span v-for="(char, index) in text" :key="index" :style="{ animationDelay: (index * 0.05) + 's' }">
            {{ char === ' ' ? '\u00A0' : char }}
        </span>
        </h1>
    </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0 4rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.dancing-text {
  margin-top: 2rem;
  display: inline-block;
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-primary);
}

.dancing-text span {
  display: inline-block;
  animation: randomDance 2.5s ease-in-out infinite;
}

/* Cada letra com tempo e delay diferente */
.dancing-text span:nth-child(odd) {
  animation-duration: 2.2s;
}

.dancing-text span:nth-child(even) {
  animation-duration: 2.8s;
}

.dancing-text span:nth-child(3n) {
  animation-delay: 0.2s;
}

.dancing-text span:nth-child(4n) {
  animation-delay: 0.4s;
}

.dancing-text span:nth-child(5n) {
  animation-delay: 0.1s;
}

@keyframes randomDance {
  0%   { transform: translate(0, 0) rotate(0deg) scale(1); }
  20%  { transform: translate(-2px, -6px) rotate(-3deg) scale(1.05); }
  40%  { transform: translate(3px, -10px) rotate(2deg) scale(0.98); }
  60%  { transform: translate(-3px, -4px) rotate(4deg) scale(1.04); }
  80%  { transform: translate(2px, -8px) rotate(-2deg) scale(1.02); }
  100% { transform: translate(0, 0) rotate(0deg) scale(1); }
}
</style>