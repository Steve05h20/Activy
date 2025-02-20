<script setup lang="ts">
import { useCart } from '@/stores/cart.store';
import { useSeance } from '@/stores/seance.store';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAuth } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import CartActivityCard from './CartActivityCard.vue';
import ActionButton from '@/components/ui/ActionButton.vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import EmptyStateCard from '@/components/ui/EmptyStateCard.vue';
import ErrorAlert from '@/components/ui/ErrorAlert.vue';

const cart = useCart();
const seanceStore = useSeance();
const toastStore = useToastStore();
const { items } = storeToRefs(cart);
const processing = ref(false);
const error = ref<string | null>(null);

const ICONS = {
  delete: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  payment: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
};

const handlePayment = async () => {
  try {
    processing.value = true;
    error.value = null;

    const { stateAcount } = useAuth();
    if (!stateAcount.connecte || !stateAcount.utilisateur) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const cartData = {
      userId: stateAcount.utilisateur.uid,
      userEmail: stateAcount.utilisateur.email,
      cartItems: items.value.map(item => ({
        activityId: item._id!,
        price: item.cout
      }))
    };

    const response = await fetch('http://localhost:3000/api/seances/process-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors du traitement du panier');
    }

    cart.clearCart();
    await seanceStore.fetchUserSeances();
    toastStore.success('Paiement réussi ! Vos activités ont été réservées.');
  } catch (err: Error | unknown) {
    error.value = err instanceof Error ? err.message : "Erreur lors du paiement. Veuillez réessayer.";
    toastStore.error(error.value);
    console.error(err);
  } finally {
    processing.value = false;
  }
};
</script>

<template>
  <div class="mb-8">
    <PageHeader
      title="Mon Panier d'Activités"
      :count="items.length"
      countLabel="activité(s)"
    />

    <ErrorAlert v-if="error" :message="error" />

    <EmptyStateCard
      v-if="items.length === 0"
      title="Votre panier est vide"
      description="Ajoutez des activités à votre panier pour commencer"
      actionLabel="Découvrir les activités"
      actionRoute="/"
    />

    <div v-else>
      <div class="grid gap-4">
        <CartActivityCard
          v-for="item in items"
          :key="item._id"
          :item="item"
          :on-remove="cart.removeFromCart"
        />
      </div>

      <!-- Résumé du panier -->
      <div class="card bg-base-200 mt-6">
        <div class="card-body">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-4">
              <span class="text-lg">Total:</span>
              <span class="text-2xl font-bold text-primary">{{ cart.totalAmount }}$</span>
            </div>
            <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <ActionButton
                variant="error"
                :icon="ICONS.delete"
                :disabled="processing"
                @click="cart.clearCart"
              >
                Vider le panier
              </ActionButton>
              <ActionButton
                variant="primary"
                :icon="ICONS.payment"
                :disabled="processing"
                @click="handlePayment"
              >
                {{ processing ? 'Traitement...' : 'Procéder au paiement' }}
                <span v-if="processing" class="loading loading-spinner ml-2"></span>
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
