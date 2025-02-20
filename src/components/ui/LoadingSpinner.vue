<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  centered: true
});
</script>

<template>
  <div :class="{ 'flex justify-center items-center py-12': centered }">
    <span class="loading loading-spinner" :class="`loading-${size}`"></span>
  </div>
</template>
