<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '@/stores/auth.store';
import { useSeance } from '@/stores/seance.store';
import { storeToRefs } from 'pinia';
import ActivityCard from './ActivityCard.vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import EmptyStateCard from '@/components/ui/EmptyStateCard.vue';
import ErrorAlert from '@/components/ui/ErrorAlert.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const { stateAcount } = useAuth();
const seanceStore = useSeance();
const { seances: reservedActivities, loading, error } = storeToRefs(seanceStore);

const ICONS = {
  clean: 'M6 18L18 6M6 6l12 12'
};

onMounted(() => {
  if (stateAcount.connecte) {
    seanceStore.fetchUserSeances();
  }
});
</script>

<template>
  <div class="mt-8">
    <PageHeader
      title="Mes Activités Réservées"
      :count="reservedActivities.length"
      countLabel="réservation(s)"
      :action-icon="ICONS.clean"
      actionTooltip="Nettoyer les activités annulées"
      :on-action="seanceStore.cleanCancelledSeances"
    />

    <ErrorAlert v-if="error" :message="error" />
    <LoadingSpinner v-else-if="loading" size="lg" />
    <EmptyStateCard
      v-else-if="reservedActivities.length === 0"
      title="Aucune activité réservée"
      description="Commencez par réserver des activités pour les voir apparaître ici"
      actionLabel="Découvrir les activités"
      actionRoute="/"
    />

    <div v-else class="grid gap-4">
      <ActivityCard
        v-for="seance in reservedActivities"
        :key="seance._id"
        :seance="seance"
        :on-cancel="seanceStore.cancelSeance"
        :on-delete="seanceStore.deleteSeance"
      />
    </div>
  </div>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>
