<script setup lang="ts">
import { formatDate } from '@/pipes/datePipe';
import BaseCard from '@/components/ui/BaseCard.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import ActionButton from '@/components/ui/ActionButton.vue';

interface ActivityProps {
  seance: {
    _id: string;
    activityId: {
      titre: string;
      type: string;
      date: string;
      heure: string;
      image: string;
    };
    status: 'payée' | 'annulée' | 'en_attente';
    dateReservation: string;
    montantPayé: number;
  };
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

defineProps<ActivityProps>();

const ICONS = {
  cancel: 'M6 18L18 6M6 6l12 12',
  delete: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
};
</script>

<template>
  <BaseCard
    :image="seance.activityId.image"
    :image-alt="seance.activityId.titre"
    size="lg"
  >
    <div class="flex flex-col md:flex-row justify-between items-start gap-4">
      <div>
        <h3 class="card-title text-xl">{{ seance.activityId.titre }}</h3>
        <div class="flex gap-2 mt-2">
          <StatusBadge :status="seance.status" />
          <div class="badge badge-primary">{{ seance.activityId.type }}</div>
        </div>
        <div class="mt-4 space-y-1 text-base-content/80">
          <p>Date: {{ formatDate(seance.activityId.date) }}</p>
          <p>Heure: {{ seance.activityId.heure }}</p>
          <p class="text-sm">Réservée le {{ formatDate(seance.dateReservation) }}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-primary">{{ seance.montantPayé }}$</p>
        <div class="flex flex-col gap-2 mt-4">
          <ActionButton
            v-if="seance.status !== 'annulée'"
            variant="error"
            :icon="ICONS.cancel"
            @click="onCancel(seance._id)"
          >
            Annuler
          </ActionButton>
          <ActionButton
            v-if="seance.status === 'annulée'"
            variant="ghost"
            :icon="ICONS.delete"
            @click="onDelete(seance._id)"
          >
            Supprimer
          </ActionButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
