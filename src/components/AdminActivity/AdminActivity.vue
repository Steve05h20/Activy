<template>
    <TableRowEdit :activity="activityToEdit" @activityUpdated="handleActivityUpdated"  />
        <div class="mt-4 overflow-y-scroll h-[400px] mx-auto rounded-xl bg-gray-100 shadow-xs">
          <TableRowBody v-for="activity in activityStore.activities" @editActivity="handleEditActivity"
          :key="activity._id"
          :_id="activity._id"
          :titre="activity.titre"
          :type="activity.type"
          :cout="activity.cout"
          :date="activity.date"
          :heure="activity.heure"
          :image="activity.image"
          class="mt-2"
          />
          </div>
</template>

<script lang="ts" setup>
import TableRowBody from './TableRowBody.vue';
import TableRowEdit from './TableRowEdit.vue';

import type { IActivity } from '@/interface/activity.type';
import { useActivities } from '@/stores/activity.store';
import { onMounted, ref } from 'vue';

const activityStore = useActivities();


const activityToEdit = ref<IActivity | null>(null);

onMounted(async () => {
  await activityStore.getActivities();
});

const handleEditActivity = (activity: IActivity) => {
  activityToEdit.value = activity;
};

const handleActivityUpdated = () => {
  activityToEdit.value = null;
};

</script>
