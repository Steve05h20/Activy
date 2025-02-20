<script setup lang="ts">
// Pas de props nécessaires
</script>

<template>
  <div class="card bg-base-200 shadow-xl">
    <div class="card-body items-center text-center">
      <h3 class="card-title text-xl mb-2">Aucune activité réservée</h3>
      <p class="text-base-content/70">Commencez par réserver des activités pour les voir apparaître ici</p>
      <div class="card-actions mt-4">
        <router-link to="/" class="btn btn-primary">
          Découvrir les activités
        </router-link>
      </div>
    </div>
  </div>
</template>
