<script setup lang="ts">
import PriceDisplay from './PriceDisplay.vue';

defineProps<{
  participant: {
    email: string;
    status: string;
    dateReservation: string;
    montantPayé: number;
    _id: string;
  }
}>();

const emit = defineEmits<{
  (e: 'cancel', id: string): void
}>();
</script>

<template>
  <div class="bg-base-100 p-3 rounded-lg shadow-sm">
    <div class="grid grid-cols-2 gap-2">
      <div class="text-sm font-semibold">Email:</div>
      <div class="text-sm">{{ participant.email }}</div>

      <div class="text-sm font-semibold">Date:</div>
      <div class="text-sm">
        {{ new Date(participant.dateReservation).toLocaleDateString() }}
      </div>

      <div class="text-sm font-semibold">Statut:</div>
      <div>
        <span :class="{
          'badge text-xs': true,
          'badge-success': participant.status === 'payée',
          'badge-error': participant.status === 'annulée'
        }">
          {{ participant.status }}
        </span>
      </div>

      <div class="text-sm font-semibold">Montant:</div>
      <div class="text-sm">
        <PriceDisplay :amount="participant.montantPayé" />
      </div>
    </div>

    <div class="mt-2" v-if="participant.status === 'payée'">
      <button class="btn btn-error btn-xs w-full"
              @click="emit('cancel', participant._id)">
        Annuler
      </button>
    </div>
  </div>
</template>
