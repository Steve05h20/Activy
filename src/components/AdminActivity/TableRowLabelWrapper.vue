<template>
  <div class="label" v-if="vif">
    <span class="label-text-alt text-error">
      <slot/>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
  vif: boolean;
}>();
</script>
