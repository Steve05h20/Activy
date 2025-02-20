<script lang="ts" setup>
import type { IActivity, TypeAcitivity } from '@/interface/activity.type';
import { formatDate } from '@/pipes/datePipe';
import { useAuth } from '@/stores/auth.store';
import { useCart } from '@/stores/cart.store';

const props = defineProps<{
  _id?: string;
  titre: string;
  type: string;
  cout: number;
  date: string | Date;
  heure: string;
  image: string;
}>();

const { stateAcount } = useAuth();
const cart = useCart();

const alertNonConnecte = (e: Event) => {
  if (!stateAcount.connecte) {
    e.preventDefault();
    alert("Veuillez-vous connecter");
  }
};

const handleAddToCart = (e: Event) => {
  e.stopPropagation(); // Empêche la propagation du clic
  if (stateAcount.connecte && props._id) {
    const activityToAdd: IActivity = {
      _id: props._id,
      titre: props.titre,
      type: props.type as TypeAcitivity,
      cout: props.cout,
      date: props.date,
      heure: props.heure,
      image: props.image
    };
    cart.addToCart(activityToAdd);
  }
};
</script>

<template>
  <div v-if="titre" @click="alertNonConnecte" class="card bg-base-100 scale-95 hover:scale-100 transition-all ease-in-out duration-300 shadow-sm w-full">
    <!-- Structure en grid pour une meilleure organisation -->
    <div class="grid grid-rows-[200px_1fr] h-[450px] rounded-2xl">
      <!-- Section image avec hauteur fixe -->
      <figure class="w-full h-full">
        <img class="w-full h-full object-cover"
          :src="image"
          :alt="titre"/>
      </figure>

      <!-- Section contenu avec grid pour espacement uniforme -->
      <div class="card-body grid grid-rows-[auto_auto_1fr_auto] gap-2 p-4">
        <!-- En-tête avec badge et titre -->
        <div class="space-y-2">
          <p class="badge badge-primary">{{ type }}</p>
          <h2 class="card-title text-xl line-clamp-2">{{ titre }}</h2>
        </div>

        <!-- Informations de date et heure -->
        <div class="space-y-1 text-sm">
          <p>Date: {{ formatDate(date) }}</p>
          <p>Heure de depart: {{ heure }}</p>
        </div>

        <!-- Espacement flexible -->
        <div class="flex-grow"></div>

        <!-- Footer avec prix et bouton -->
        <div class="card-actions items-center justify-between mt-auto">
          <h3 class="text-3xl font-bold text-accent">{{ cout }}$</h3>
          <button
            :hidden="!stateAcount.connecte"
            class="btn btn-primary"
            @click="handleAddToCart"
            :disabled="!_id"
          >
            Reserver
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="card bg-base-100 shadow-sm animate-pulse">
    <figure class="h-48 bg-gray-200"></figure>
    <div class="card-body">
      <div class="h-6 w-24 bg-gray-200 rounded"></div>
      <div class="h-8 w-3/4 bg-gray-200 rounded"></div>
      <div class="h-6 w-1/2 bg-gray-200 rounded"></div>
      <div class="h-6 w-1/3 bg-gray-200 rounded"></div>
      <div class="card-actions items-center justify-between">
        <div class="h-8 w-24 bg-gray-200 rounded"></div>
        <div class="h-10 w-28 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
</template>

