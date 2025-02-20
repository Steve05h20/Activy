<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useSeance } from '@/stores/seance.store';
import { useToastStore } from '@/stores/toast.store';
import ActivityHeader from './ActivityHeader.vue';
import SeanceCard from './SeanceCard.vue';
import SeanceTable from './SeanceTable.vue';

const seanceStore = useSeance();
const toastStore = useToastStore();

// Grouper les séances par activité
const groupedSeances = computed(() => {
  const grouped: Record<string, {
    activity: {
      _id: string;
      titre: string;
      type: string;
      date: string;
      heure: string;
      cout: number;
    },
    participants: Array<{
      email: string;
      status: string;
      dateReservation: string;
      montantPayé: number;
      _id: string;
    }>
  }> = {};

  seanceStore.seances.forEach((seance) => {
    const titre = seance.activityId.titre;
    if (!grouped[titre]) {
      grouped[titre] = {
        activity: {
          _id: seance.activityId._id,
          titre: seance.activityId.titre,
          type: seance.activityId.type,
          date: seance.activityId.date,
          heure: seance.activityId.heure,
          cout: seance.activityId.cout
        },
        participants: []
      };
    }
    grouped[titre].participants.push({
      email: seance.userEmail,
      status: seance.status,
      dateReservation: seance.dateReservation,
      montantPayé: seance.montantPayé,
      _id: seance._id
    });
  });
  return grouped;
});

onMounted(() => {
  seanceStore.fetchAllSeances();
});

const handleCancelSeance = async (seanceId: string) => {
  try {
    await seanceStore.cancelSeance(seanceId);
    await seanceStore.fetchAllSeances();
    toastStore.success('La séance a été annulée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la séance:', error);
    toastStore.error('Erreur lors de l\'annulation de la séance');
  }
};
</script>

<template>
  <div class="p-2 md:p-4">
    <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6">Gestion des Séances</h2>

    <div v-if="seanceStore.loading" class="flex justify-center items-center min-h-[200px]">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="seanceStore.error" class="alert alert-error">
      {{ seanceStore.error }}
    </div>

    <div v-else-if="Object.keys(groupedSeances).length === 0"
         class="alert alert-info">
      Aucune séance n'est disponible pour le moment.
    </div>

    <div v-else v-for="(data, titre) in groupedSeances"
         :key="titre"
         class="mb-4 md:mb-8 bg-base-200 p-2 md:p-4 rounded-lg">

      <ActivityHeader :activity="data.activity" />

      <div class="">
        <!-- Version mobile -->
        <div class="md:hidden space-y-4">
          <SeanceCard
            v-for="participant in data.participants"
            :key="participant.email"
            :participant="participant"
            @cancel="handleCancelSeance"
          />
        </div>

        <!-- Version desktop -->
        <SeanceTable
          :participants="data.participants"
          @cancel="handleCancelSeance"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .table-container {
    margin: -1rem;
  }
}
</style>
