<script setup lang="ts">
import PriceDisplay from './PriceDisplay.vue';

defineProps<{
  participants: Array<{
    email: string;
    status: string;
    dateReservation: string;
    montantPayé: number;
    _id: string;
  }>
}>();

const emit = defineEmits<{
  (e: 'cancel', id: string): void
}>();
</script>

<template>
  <table class="hidden md:table table-zebra w-full">
    <thead>
      <tr>
        <th>Email Participant</th>
        <th>Date de Réservation</th>
        <th>Statut</th>
        <th>Montant Payé</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="participant in participants" :key="participant.email">
        <td class="max-w-[200px] truncate">{{ participant.email }}</td>
        <td>{{ new Date(participant.dateReservation).toLocaleDateString() }}</td>
        <td>
          <span :class="{
            'badge': true,
            'badge-success': participant.status === 'payée',
            'badge-error': participant.status === 'annulée'
          }">
            {{ participant.status }}
          </span>
        </td>
        <td>
          <PriceDisplay :amount="participant.montantPayé" />
        </td>
        <td>
          <button class="btn btn-error btn-xs"
                  v-if="participant.status === 'payée'"
                  @click="emit('cancel', participant._id)">
            Annuler
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
