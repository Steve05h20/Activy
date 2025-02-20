<script setup lang="ts">
defineProps<{
  click?: () => void;
}>()
</script>

<template>

  <button @click="click" class="mx-1 my-2 btn btn-primary text-primary-content w-32">
    <slot/>
  </button>

</template>

<style scoped>

</style>
