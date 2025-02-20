<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from "@/components/AppHeader.vue";
import Toast from '@/components/Toast/Toast.vue';
</script>

<template>
  <div class="relative">
    <AppHeader class="fixed top-0 left-0 right-0 z-50"/>
    <RouterView class="pt-17 xl:w-[1400px] mx-auto transition-all" />
    <Toast />
  </div>
</template>

<style>
:root {
  --header-height: 60px;
}
</style>
