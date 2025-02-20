<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  countLabel?: string;
  actionIcon?: string;
  actionTooltip?: string;
  onAction?: () => void;
}

withDefaults(defineProps<Props>(), {
  countLabel: 'élément(s)',
  actionTooltip: '',
});
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <div class="flex items-center gap-2">
      <div v-if="count !== undefined" class="badge badge-lg">
        {{ count }} {{ countLabel }}
      </div>
      <div v-if="actionIcon && onAction" class="tooltip" :data-tip="actionTooltip">
        <button
          class="btn btn-circle btn-sm btn-ghost"
          @click="onAction"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="actionIcon" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
