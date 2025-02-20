<script lang="ts" setup>
import { useUsers } from '@/stores/user.store';
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const userStore = useUsers();
console.log('Store initialisé:', userStore);
const router = useRouter();
const route = useRoute();

// Surveiller les changements dans userStore.users
watch(() => userStore.users, (newUsers) => {
  console.log('Users changés:', newUsers);
}, { deep: true });

onMounted(async () => {
  console.log('Chargement des utilisateurs...');
  try {
    await userStore.getUsers();
    console.log('Utilisateurs chargés:', userStore.users);
    if (!userStore.users || userStore.users.length === 0) {
      console.log('Aucun utilisateur trouvé');
      if (userStore.error) {
        console.error('Erreur store:', userStore.error);
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
  }
});

// Recharger la liste quand on revient sur la page
watch(() => route.path, async (newPath) => {
  if (newPath === '/admin/user') {
    await userStore.getUsers();
  }
});

const desactiverCompte = (uid: string, checked: boolean) => userStore.editUser(uid, { disabled: !checked });
const updateUserName = (uid: string, newName: string) => userStore.editUser(uid, { displayName: newName });
const deleteUser = (uid: string) => userStore.removeUser(uid);
const deleteConfirmation = ref<{ [key: string]: boolean }>({});
const showDeleteconfirmation = (uid: string) => {
  deleteConfirmation.value[uid] = !deleteConfirmation.value[uid];
};

const redirectToSignUp = () => {
  // Stocker la page de retour
  sessionStorage.setItem('redirectAfterSignUp', '/admin/user');
  router.push('/inscription');
};
</script>

<template>
  <div class="mb-8">
    <button @click="redirectToSignUp" class="btn btn-primary">
      Ajouter un utilisateur
    </button>
  </div>

  <!-- Ajout d'un message si aucun utilisateur n'est trouvé -->
  <div v-if="!userStore.users || userStore.users.length === 0" class="text-center p-4">
    Aucun utilisateur trouvé
  </div>

  <div v-else class="ta grid grid-cols-3 gap-4 mt-4">
    <div class="col-span-3 grid grid-cols-3 gap-4 font-bold bg-base-200 py-2 text-left">
      <div>Information</div>
      <div class="text-center">Désactivé</div>
      <div class="text-center">Édition</div>
    </div>
    <template v-for="user in userStore.users" :key="user.uid">
      <div class="text-left">
        <input class="font-semibold input input-xs" v-model="user.displayName" @change="updateUserName(user.uid, user.displayName || '')" />
        <div class="italic text-gray-400 text-xs">{{ user.email }}</div>
      </div>
      <div class="text-center">
        <input type="checkbox" class="toggle toggle-success transition-transform duration-300 ease-in-out" @change="desactiverCompte(user.uid, !!user.disabled)" :checked="!user.disabled" />
      </div>
      <div class="text-center transition-transform duration-300 ease-in-out">
        <button v-if="!deleteConfirmation[user.uid]" @click="showDeleteconfirmation(user.uid)" class="btn btn-danger btn-xs">Supprimer</button>
        <div v-else>
          <button @click="deleteUser(user.uid)" class="btn btn-danger btn-xs">Confirmer</button>
          <button @click="showDeleteconfirmation(user.uid)" class="btn btn-secondary btn-xs">X</button>
        </div>
      </div>
    </template>
  </div>
</template>
