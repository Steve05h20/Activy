import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuth } from './auth.store';
import { useFetchSeance } from '@/composables/useFetchSeance';
import { useToastStore } from './toast.store';

export interface Seance {
  _id: string;
  userId: string;
  userEmail: string;
  activityId: {
    _id: string;
    titre: string;
    type: string;
    date: string;
    heure: string;
    cout: number;
    image: string;
  };
  dateReservation: string;
  status: 'payée' | 'annulée';
  montantPayé: number;
}

export const useSeance = defineStore('seance', () => {
  const seances = ref<Seance[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const auth = useAuth();
  const seanceApi = useFetchSeance();
  const toastStore = useToastStore();

  // Créer une nouvelle séance
  async function createSeance(activityId: string, montantPayé: number, activityName: string) {
    try {
      loading.value = true;
      error.value = null;

      const seanceData = {
        userId: auth.stateAcount.utilisateur?.uid || '',
        userEmail: auth.stateAcount.utilisateur?.email || '',
        activityId,
        montantPayé
      };

      const newSeance = await seanceApi.createSeance(seanceData);
      seances.value.unshift(newSeance);
      toastStore.success(`Réservation de ${activityName} effectuée avec succès !`);
      return newSeance;
    } catch (err) {
      error.value = "Erreur lors de la création de la séance";
      toastStore.error(`Erreur lors de la réservation de ${activityName}`);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Récupérer les séances de l'utilisateur
  async function fetchUserSeances() {
    try {
      loading.value = true;
      error.value = null;

      const userId = auth.stateAcount.utilisateur?.uid;
      if (!userId) {
        toastStore.error('Utilisateur non connecté');
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch(`http://localhost:3000/api/seances/user/${userId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des séances');
      }

      seances.value = await response.json();
    } catch (err) {
      error.value = "Erreur lors de la récupération des séances";
      toastStore.error("Erreur lors de la récupération des séances");
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  // Annuler une séance
  async function cancelSeance(seanceId: string) {
    try {
      loading.value = true;
      error.value = null;

      // Trouver la séance avant de l'annuler pour avoir le nom de l'activité
      const seance = seances.value.find(s => s._id === seanceId);
      if (!seance) {
        throw new Error('Séance non trouvée');
      }

      const response = await fetch(`http://localhost:3000/api/seances/${seanceId}/cancel`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la séance');
      }

      await fetchUserSeances();
      toastStore.success(`La réservation pour ${seance.activityId.titre} a été annulée`);
    } catch (err) {
      error.value = "Erreur lors de l'annulation de la séance";
      toastStore.error("Erreur lors de l'annulation de la séance");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Supprimer une séance
  async function deleteSeance(seanceId: string) {
    try {
      loading.value = true;
      error.value = null;

      // Trouver la séance avant de la supprimer pour avoir le nom de l'activité
      const seance = seances.value.find(s => s._id === seanceId);
      if (!seance) {
        throw new Error('Séance non trouvée');
      }

      const response = await fetch(`http://localhost:3000/api/seances/${seanceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression de la séance');
      }

      await fetchUserSeances();
      toastStore.success(`La réservation pour ${seance.activityId.titre} a été supprimée`);
    } catch (err) {
      error.value = "Erreur lors de la suppression de la séance";
      toastStore.error("Erreur lors de la suppression de la séance");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Nettoyer les séances annulées
  function cleanCancelledSeances() {
    seances.value = seances.value.filter(s => s.status !== 'annulée');
  }

  // Récupérer l'historique des séances
  async function fetchSeanceHistory() {
    try {
      loading.value = true;
      error.value = null;

      const userId = auth.stateAcount.utilisateur?.uid;
      if (!userId) throw new Error('Utilisateur non connecté');

      return await seanceApi.fetchSeanceHistory(userId);
    } catch (err) {
      error.value = "Erreur lors de la récupération de l'historique";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Récupérer toutes les séances (pour l'admin)
  async function fetchAllSeances() {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch('http://localhost:3000/api/seances');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des séances');
      }

      seances.value = await response.json();
    } catch (err) {
      error.value = "Erreur lors de la récupération des séances";
      toastStore.error("Erreur lors de la récupération des séances");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    seances,
    loading,
    error,
    createSeance,
    fetchUserSeances,
    fetchAllSeances,
    cancelSeance,
    deleteSeance,
    cleanCancelledSeances,
    fetchSeanceHistory
  };
});
