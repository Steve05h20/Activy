<script setup lang="ts">

import { RouterLink } from 'vue-router'
import AppButton from './ui/AppButton.vue';


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
