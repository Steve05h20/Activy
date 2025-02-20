<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store'
import { storeToRefs } from 'pinia'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div class="toast" v-for="toast in toasts" :key="toast.id">
        <div :class="['alert', `alert-${toast.type}`]" @click="toastStore.removeToast(toast.id)">
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--header-height);
  right: 0;
  padding-top: 1rem;
  padding-right: 1rem;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  width: 300px;
  pointer-events: auto;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  font-weight: 500;
  font-size: 0.875rem;
}

.alert-success {
  background-color: #4caf50;
  border: 1px solid #43a047;
}

.alert-error {
  background-color: #f44336;
  border: 1px solid #e53935;
}

.alert-warning {
  background-color: #ff9800;
  border: 1px solid #fb8c00;
}

.alert-info {
  background-color: #2196f3;
  border: 1px solid #1e88e5;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .toast {
    width: calc(100vw - 2rem);
  }
}
</style>
