<script lang="ts" setup>
import type { IActivity } from '@/interface/activity.type';
import { formatDate } from '@/pipes/datePipe';
import { useActivities } from '@/stores/activity.store';
import { capitalize, defineProps, defineEmits } from 'vue';

const activity = defineProps<IActivity>();
const activityStore = useActivities();
const emit = defineEmits(['editActivity']);

const handleEdit = () => {
  emit('editActivity', activity);
};
</script>

<template>
  <div tabindex="0" class="collapse transition-all collapse-arrow border border-base-300 bg-base-100 rounded-box shadow-lg">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-xl font-medium flex justify-center items-center flex-col ">
      {{ capitalize(activity.titre) }}
    </div>
    <div class="collapse-content grid grid-cols-3 gap-4 p-4 max-sm:grid-cols-1">
      <img :src="activity.image" alt="Activity Image" class="rounded-lg shadow-md h-24 w-full object-cover" />
      <div class="activity-details flex justify-center text-xs flex-col">
        <p><strong>Type:</strong> {{ activity.type }}</p>
        <p><strong>Date:</strong> {{ formatDate(activity.date) }}</p>
        <p><strong>Heure:</strong> {{ activity.heure }}</p>
        <p><strong>Coût:</strong> {{ activity.cout }}$</p>
      </div>
      <div class="flex justify-center flex-col">
        <button @click="handleEdit" class="btn btn-primary my-2 col-span-2">Edit</button>
        <button @click="activityStore.removeActivity(activity._id ?? '')" class="btn btn-secondary my-2 col-span-2 btn-sm">Delete</button>
      </div>
    </div>
  </div>
</template>
