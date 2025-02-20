import { ref } from 'vue';
import { getAuth } from 'firebase/auth';

interface Seance {
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

export function useFetchSeance() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const API_URL = 'http://localhost:3000/api/seances';

  // Fonction utilitaire pour obtenir les headers avec le token
  async function getHeaders() {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Créer une nouvelle séance
  async function createSeance(seanceData: { userId: string; userEmail: string; activityId: string; montantPayé: number }) {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(seanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la séance');
      }

      return await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur lors de la création de la séance";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Récupérer les séances d'un utilisateur
  async function fetchUserSeances(userId: string): Promise<Seance[]> {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`${API_URL}/user/${userId}`, {
        headers: await getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des séances');
      }

      return await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur lors de la récupération des séances";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Annuler une séance
  async function cancelSeance(seanceId: string): Promise<Seance> {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`${API_URL}/${seanceId}/cancel`, {
        method: 'PUT',
        headers: await getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'annulation de la séance');
      }

      return await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur lors de l'annulation de la séance";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Récupérer l'historique des séances
  async function fetchSeanceHistory(userId: string): Promise<Seance[]> {
    try {
      loading.value = true;
      error.value = null;

      const response = await fetch(`${API_URL}/history/${userId}`, {
        headers: await getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération de l\'historique');
      }

      return await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur lors de la récupération de l'historique";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    createSeance,
    fetchUserSeances,
    cancelSeance,
    fetchSeanceHistory
  };
}
