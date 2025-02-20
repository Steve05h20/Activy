<script setup lang="ts">
import PriceDisplay from './PriceDisplay.vue';

defineProps<{
  activity: {
    titre: string;
    type: string;
    date: string;
    heure: string;
    cout: number;
  }
}>();
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
    <div>
      <h3 class="text-lg md:text-xl font-semibold">{{ activity.titre }}</h3>
      <p class="text-sm text-gray-600">
        Type: {{ activity.type }} -
        <PriceDisplay :amount="activity.cout" />
      </p>
    </div>
    <div class="text-sm space-y-1 md:space-y-0">
      <span class="block md:inline md:mr-4">
        Date: {{ new Date(activity.date).toLocaleDateString() }}
      </span>
      <span class="block md:inline">
        Heure: {{ activity.heure }}
      </span>
    </div>
  </div>
</template>
