
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useFetch } from '@/composables/useFetchActivity';
import type { IActivity } from '@/interface/activity.type';


export const useActivities = defineStore('activities', () => {
  const activities = ref<IActivity[]>([]);
  const activity = ref<IActivity | null>(null);

 //composable useFetch
  const {
    data,
    error,
    loading,
    fetchActivities,
    createActivity,
    deleteActivity,
    updateActivity
  } = useFetch();

  const findActivityById = (_id: string) => {
    activity.value = activities.value.find((i) => i._id === _id) || null;
  };

  const getActivities = async () => {
    await fetchActivities();
    activities.value = data.value;
  };

  const addActivity = async (newActivity: Omit<IActivity, '_id'>) => {
    const result = await createActivity(newActivity);
    if (result) {
      activities.value = data.value;
    }
    return result;
  };

  const removeActivity = async (_id: string) => {
    const result = await deleteActivity(_id);
    if (result) {
      activities.value = activities.value.filter((i) => i._id !== _id);
    }
    return result;
  };

  const editActivity = async (id: string, activity: Partial<IActivity>) => {
    const result = await updateActivity(id, activity);
    if (result) {
      activities.value = activities.value.map((i) => {
        if (i._id === id) {
          return { ...i, ...activity };
        }
        return i;
      });
    }
    return result;
  }



  return {
    removeActivity,
    activities,
    activity,
    error,
    loading,
    findActivityById,
    getActivities,
    addActivity,
    editActivity
  };
});
