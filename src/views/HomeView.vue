<script setup lang="ts">
import ActivityCard from '@/components/Card/ActivityCard.vue';
import ActivityCardSqueleton from '@/components/Card/ActivityCardSqueleton.vue';
import { useActivities } from '@/stores/activity.store';
import { onMounted, ref } from 'vue';

const activityStore = useActivities();
const errorMessage = ref('');

onMounted(async () => {
  try {
    await activityStore.getActivities();
  } catch  {
    errorMessage.value = 'Erreur lors du chargement des activités.';
  }
});
</script>

<template>
  <main class="">
    <section class="grid gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 grid-cols-5 transition-all ">
      <template v-if="activityStore.loading">
        <ActivityCardSqueleton  v-for="n in 8" :key="n" />
      </template>

      <template v-if="errorMessage">
        <div class="flex flex-col items-center justify-center w-screen">
          <h1 class="text-5xl text-red-500">{{ errorMessage }}</h1>
        </div>
      </template>

      <template v-if="activityStore.activities.length === 0 && !activityStore.loading && !errorMessage">
        <div class="flex flex-col items-center justify-center w-screen">
          <h1 class="text-5xl">Aucune Activité disponible</h1>
          <ActivityCardSqueleton class="w-full" v-for="n in 1" :key="n" />
        </div>
      </template>

      <ActivityCard
        v-else
        v-for="activity in activityStore.activities"
        :key="activity._id"
        :_id="activity._id"
        :titre="activity.titre"
        :type="activity.type"
        :cout="activity.cout"
        :date="activity.date"
        :heure="activity.heure"
        :image="activity.image"
      />
    </section>
  </main>
</template>
