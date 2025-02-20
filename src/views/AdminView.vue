<script setup lang="ts">

import { useAdminAuth } from '@/stores/authAdmin.store';
import { RouterLink, RouterView } from 'vue-router';
const useAdminAuthStore = useAdminAuth()


</script>

<!-- /*Votre interface doit avoir les mécanismes nécessaires (pages et/ou boites de dialogue) pour l’ajout, la modification et la suppression des adhérents, des activités, des séances. /* -->

<template>
  <div>
    <h1 class="text-4xl">Administration</h1>
    <div class="join my-5">
      <RouterLink to="/admin/activity" class="join-item btn btn-sm" :class="{ 'btn-active': $route.path === '/admin/activity' }">Activité</RouterLink>
      <RouterLink to="/admin/user" class="join-item btn btn-sm" :class="{ 'btn-active': $route.path === '/admin/user' }">Membre</RouterLink>
      <RouterLink to="/admin/Seance" class="join-item btn btn-sm" :class="{ 'btn-active': $route.path === '/admin/Seance' }">Seance</RouterLink>
      <RouterLink to="/" class="join-item btn btn-sm btn-error" :class="{ 'btn-active': $route.path === '/admin/Seance' }"><button @click="useAdminAuthStore.logout">Se deconnecter</button></RouterLink>
    </div>
    <router-view></router-view>
  </div>
</template>
