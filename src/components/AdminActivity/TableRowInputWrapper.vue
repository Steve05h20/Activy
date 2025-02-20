<template>
<div class="form-control w-full">
      <label class="label">
        <span class="label-text text-xs font-semibold">{{label}}</span>
      </label>
<slot/>
      </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
  label: string;
}>();
</script>
