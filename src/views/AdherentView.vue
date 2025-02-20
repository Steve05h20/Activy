<script setup lang="ts">
import { useAuth } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import CartSummary from '@/components/Adherent/CartSummary.vue';
import ReservedActivities from '@/components/Adherent/ReservedActivities.vue';

const { stateAcount } = useAuth();
const router = useRouter();

// Vérification de l'authentification
onMounted(() => {
  if (!stateAcount.connecte) {
    router.push('/');
  }
});
</script>

<template>
  <div class="container mx-auto p-4 max-w-7xl">
    <h1 class="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Mon Espace Adhérent</h1>

    <!-- Composant résumé du panier -->
    <CartSummary />

    <!-- Composant activités réservées -->
    <ReservedActivities />
  </div>
</template>
