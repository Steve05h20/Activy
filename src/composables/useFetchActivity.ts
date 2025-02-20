// src/composables/useFetch.ts
import type { IActivity } from '@/interface/activity.type'
import { ref } from 'vue'


export function useFetch() {
  const url = "http://localhost:3000"
  const data = ref<IActivity[]>([])
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)



  const getAllActivities = async () => {
    loading.value = true
    try {
      const response = await fetch(url+'/api/activities')
      data.value = await response.json()
    } catch {
      error.value = 'Erreur lors du chargement des activités'
    } finally {
      loading.value = false
    }
  }


  const getActivityById = async (id: string) => {
    loading.value = true
    try {
      const response = await fetch(url+`/api/activities/${id}`)
      return await response.json()
    } catch {
      error.value = 'Erreur lors du chargement de l\'activité'
      return null
    } finally {
      loading.value = false
    }
  }


  const createActivity = async (activity: Omit<IActivity, '_id'>) => {
    loading.value = true
    try {
      const response = await fetch(url+'/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      })
      const newActivity = await response.json()
      data.value = [...data.value, newActivity]
      return newActivity
    } catch {
      error.value = 'Erreur lors de la création de l\'activité'
      return null
    } finally {
      loading.value = false
    }
  }

  // PUT update activity
  const updateActivity = async (id: string, activity: Partial<IActivity>) => {
    loading.value = true
    try {
      const response = await fetch(url+`/api/activities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      })
      const updatedActivity = await response.json()
      data.value = data.value.map(item =>
        item._id === id ? updatedActivity : item
      )
      return updatedActivity
    } catch  {
      error.value = 'Erreur lors de la mise à jour de l\'activité'
      return null
    } finally {
      loading.value = false
    }
  }

  // DELETE activity
  const deleteActivity = async (id: string) => {
    loading.value = true
    try {
      await fetch(url+`/api/activities/${id}`, {
        method: 'DELETE'
      })
      data.value = data.value.filter(item => item._id !== id)
      return true
    } catch  {
      error.value = 'Erreur lors de la suppression de l\'activité'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    fetchActivities: getAllActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity
  }


}
