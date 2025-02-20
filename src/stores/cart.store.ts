import { defineStore } from 'pinia';
import type { IActivity } from '@/interface/activity.type';
import { ref, computed } from 'vue';
import { useToastStore } from './toast.store';

const CART_STORAGE_KEY = 'user_cart';

export const useCart = defineStore('cart', () => {
  const toastStore = useToastStore();
  const items = ref<IActivity[]>([]);

  // Initialiser les données depuis le localStorage
  const initializeCart = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        items.value = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du panier:', error);
      items.value = [];
    }
  };

  // Initialiser le panier
  initializeCart();

  // Sauvegarder dans le localStorage
  const saveCart = () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
  };

  // Actions
  function addToCart(activity: IActivity) {
    if (!activity?._id || !activity?.titre) {
      toastStore.error("Impossible d'ajouter cette activité au panier");
      return;
    }

    const existingItem = items.value.find(item => item._id === activity._id);
    if (!existingItem) {
      const newActivity = { ...activity }; // Créer une copie de l'activité
      items.value.push(newActivity);
      saveCart();
      toastStore.success(`${newActivity.titre} a été ajouté au panier`);
    } else {
      toastStore.warning(`${activity.titre} est déjà dans votre panier`);
    }
  }

  function removeFromCart(activityId: string | undefined) {
    if (!activityId) {
      toastStore.error("Impossible de retirer cette activité du panier");
      return;
    }

    const activityToRemove = items.value.find(item => item._id === activityId);
    if (!activityToRemove?.titre) {
      toastStore.error("Cette activité n'existe pas dans le panier");
      return;
    }

    const activityTitle = activityToRemove.titre; // Garder le titre avant la suppression
    items.value = items.value.filter(item => item._id !== activityId);
    saveCart();
    toastStore.info(`${activityTitle} a été retiré du panier`);
  }

  function clearCart() {
    if (items.value.length === 0) {
      toastStore.info('Le panier est déjà vide');
      return;
    }
    items.value = [];
    saveCart();
    toastStore.info('Votre panier a été vidé');
  }

  // Getters avec computed pour la réactivité
  const cartItemsCount = computed(() => items.value.length);
  const totalAmount = computed(() => items.value.reduce((total, item) => total + item.cout, 0));

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    cartItemsCount,
    totalAmount
  };
});
