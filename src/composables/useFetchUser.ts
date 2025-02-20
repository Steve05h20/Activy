

import type { UserData } from '@/interface/user.type'
import { ref } from 'vue'

export function useFetchUser() {
  const url = "http://localhost:3000"
  const data = ref<UserData[]>([])
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  const getAllUsers = async () => {
    loading.value = true
    try {
      const response = await fetch(url+'/api/users')
      data.value = await response.json()
    } catch {
      error.value = 'Erreur lors du chargement des utilisateurs'
    } finally {
      loading.value = false
    }
  }

  const getUserById = async (id: string) => {
    loading.value = true
    try {
      const response = await fetch(url+`/api/users/${id}`)
      return await response.json()
    } catch {
      error.value = 'Erreur lors du chargement de l\'utilisateur'
      return null
    } finally {
      loading.value = false
    }
  }

  const createUser = async (user: Omit<UserData, '_id'>) => {
    loading.value = true
    try {
      const response = await fetch(url+'/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      const newUser = await response.json()
      data.value = [...data.value, newUser]
      return newUser
    } catch {
      error.value = 'Erreur lors de la création de l\'utilisateur'
      return null
    } finally {
      loading.value = false
    }
  }

  // PUT update user
  const updateUser = async (id: string, user: Partial<UserData>) => {
    loading.value = true
    try {
      const response = await fetch(url+`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      const updatedUser = await response.json()
      data.value = data.value.map(item =>
        item.uid === id ? updatedUser : item
      )
      return updatedUser
    } catch  {
      error.value = 'Erreur lors de la mise à jour de l\'utilisateur'
      return null
    } finally {
      loading.value = false
    }
  }

  // DELETE user
  const deleteUser = async (id: string) => {
    loading.value = true
    try {
      await fetch(url+`/api/users/${id}`, {
        method: 'DELETE'
      })
      data.value = data.value.filter(item => item.uid !== id)
      return true
    } catch  {
      error.value = 'Erreur lors de la suppression de l\'utilisateur'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  }
}
