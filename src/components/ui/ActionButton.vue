<template>
  <button
    class="btn btn-sm"
    :class="[
      variant === 'error' ? 'btn-error' :
      variant === 'ghost' ? 'btn-ghost' :
      'btn-primary'
    ]"
    @click="$emit('click')"
  >
    <svg
      v-if="icon"
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        :d="icon"
      />
    </svg>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'error' | 'ghost' | 'primary';
  icon?: string;
}

defineProps<Props>();
defineEmits<{
  (e: 'click'): void;
}>();
</script>
