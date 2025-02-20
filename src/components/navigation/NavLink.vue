<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import { RouterLink } from 'vue-router'

interface Props {
  to: string
  onClick?: () => void
}

defineProps<Props>()
</script>

<template>
  <RouterLink :to="to" @click="onClick">
    <AppButton class="relative">
      <slot></slot>
    </AppButton>
  </RouterLink>
</template>
