<script setup lang="ts">
defineProps<{
  reservationCount: number;
  onCleanCancelled: () => void;
}>();
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold">Mes Activités Réservées</h2>
    <div class="flex items-center gap-2">
      <div class="badge badge-lg">{{ reservationCount }} réservation(s)</div>
      <div class="tooltip" data-tip="Nettoyer les activités annulées">
        <button
          class="btn btn-circle btn-sm btn-ghost"
          @click="onCleanCancelled"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
