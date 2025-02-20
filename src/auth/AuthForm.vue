<script setup lang="ts">
import { useAuth } from '@/stores/auth.store';
import { useUsers } from '@/stores/user.store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import AppButton from '@/components/ui/AppButton.vue';


const route = useRoute();
const router = useRouter();
const auth = useAuth();
const userStore = useUsers();

const isSignUp = computed(() => route.path === '/inscription');
const isAdminSignUp = computed(() => !!window.sessionStorage.getItem('redirectAfterSignUp'));

// Gestion du submit
const handleSubmit = async (e: Event) => {
  e.preventDefault();
  if (isSignUp.value) {
    await auth.creerUtilisateur(e);
  } else {
    await auth.connecterUtilisateur(e);
  }
};

// Watch pour la redirection
watch(() => auth.stateAcount.connecte, async (newValue) => {
  if (newValue) {
    // Vérifier d'abord s'il y a une redirection après inscription
    const redirectAfterSignUp = sessionStorage.getItem('redirectAfterSignUp');
    if (redirectAfterSignUp) {
      sessionStorage.removeItem('redirectAfterSignUp');
      // Si l'inscription vient de l'admin, on attend que le displayName soit mis à jour
      if (redirectAfterSignUp.startsWith('/admin')) {
        // Attendre un peu pour s'assurer que le displayName est mis à jour
        await new Promise(resolve => setTimeout(resolve, 1000));
        await userStore.getUsers(); // Recharger la liste des utilisateurs
        await auth.deconnexion();
      }
      router.push(redirectAfterSignUp);
      return;
    }

    // Sinon, gérer la redirection normale après connexion
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    } else {
      router.push('/');
    }
  }
});
</script>

<template>
  <div class="h-screen flex items-center -translate-y-20 justify-center max-sm:flex-col-reverse">
    <form @submit.prevent="handleSubmit" class="space-y-4 w-84 mx-auto">
      <h1 class="text-2xl font-medium">{{ isSignUp ? 'Inscrivez-vous à Activy' : 'Connectez-vous à Activy' }}</h1>

      <!-- Message d'erreur global -->
      <div v-if="auth.stateAcount.errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p>{{ auth.stateAcount.errorMessage }}</p>
      </div>

      <!-- Username input -->
      <div v-if="isSignUp">
        <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
        <input
          type="text"
          v-model="auth.stateAcount.userName"
          @input="() => auth.validateUserNameRealTime(auth.stateAcount.userName)"
          id="username"
          placeholder="Entrez un nom d'utilisateur"
          :class="[
            'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
            {
              'border-red-500': auth.stateAcount.validationErrors.userName,
              'border-green-500': auth.stateAcount.userName && !auth.stateAcount.validationErrors.userName,
              'border-gray-300': !auth.stateAcount.userName
            }
          ]"
        />
        <p v-if="auth.stateAcount.validationErrors.userName" class="mt-1 text-sm text-red-600">
          {{ auth.stateAcount.validationErrors.userName }}
        </p>
      </div>

      <!-- Email input -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          v-model="auth.stateAcount.email"
          @input="() => auth.validateEmailRealTime(auth.stateAcount.email)"
          id="email"
          placeholder="Entrez l'email"
          :class="[
            'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm',
            {
              'border-red-500': auth.stateAcount.validationErrors.email,
              'border-green-500': auth.stateAcount.email && !auth.stateAcount.validationErrors.email,
              'border-gray-300': !auth.stateAcount.email
            }
          ]"
        />
        <p v-if="auth.stateAcount.validationErrors.email" class="mt-1 text-sm text-red-600">
          {{ auth.stateAcount.validationErrors.email }}
        </p>
      </div>

      <!-- Password input -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          type="password"
          v-model="auth.stateAcount.pwd"
          @input="() => auth.validatePasswordRealTime(auth.stateAcount.pwd)"
          id="password"
          placeholder="Entrez le mot de passe"
          :class="[
            'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm',
            {
              'border-red-500': auth.stateAcount.validationErrors.pwd,
              'border-green-500': auth.stateAcount.pwd && !auth.stateAcount.validationErrors.pwd,
              'border-gray-300': !auth.stateAcount.pwd
            }
          ]"
        />
        <p v-if="auth.stateAcount.validationErrors.pwd" class="mt-1 text-sm text-red-600">
          {{ auth.stateAcount.validationErrors.pwd }}
        </p>

        <!-- Indicateurs de force du mot de passe -->
        <div v-if="auth.stateAcount.pwd" class="mt-2">
          <div class="flex items-center gap-2">
            <span class="text-sm" :class="{'text-green-500': /[A-Z]/.test(auth.stateAcount.pwd)}">
              ✓ Majuscule
            </span>
            <span class="text-sm" :class="{'text-green-500': /[0-9]/.test(auth.stateAcount.pwd)}">
              ✓ Chiffre
            </span>
            <span class="text-sm" :class="{'text-green-500': auth.stateAcount.pwd.length >= 6}">
              ✓ 6+ caractères
            </span>
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <div>
        <AppButton
          :disabled="!auth.isValid || auth.stateAcount.loading"
          type="submit"
          class="w-full disabled:bg-base-100 disabled:text-primary-content"
        >
          <span v-if="auth.stateAcount.loading">Connexion en cours...</span>
          <span v-else>{{ isSignUp ? 'Créer un compte' : 'Se connecter' }}</span>
        </AppButton>
        <RouterLink
          :to="isSignUp ? '/connexion' : '/inscription'"
          class="mt-2 block text-center"
          v-if="!isAdminSignUp"
        >
          {{ isSignUp ? 'Vous avez déjà un compte ?' : "Vous n'avez pas de compte ?" }}
          <span class="text-secondary">{{ isSignUp ? 'Connectez-vous' : 'Inscrivez-vous' }}</span>
        </RouterLink>
      </div>
    </form>
  </div>
</template>
