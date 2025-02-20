<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue';
import { useAdminAuth } from '@/stores/authAdmin.store';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const pin = ref('');
const error = ref('');
const adminAuth = useAdminAuth();
const router = useRouter();

const handleSubmit = () => {
  if (pin.value.length !== 4) {
    error.value = 'Le code PIN doit contenir 4 chiffres';
    return;
  }

  if (adminAuth.verifyPin(pin.value)) {
    router.push('/admin');
  } else {
    error.value = 'Code PIN incorrect';
    pin.value = '';
  }
};
</script>

<template>
  <div class="h-screen flex items-center -translate-y-20 justify-center max-sm:flex-col-reverse">
    <form @submit.prevent="handleSubmit" class="flex flex-col items-center gap-4 ">
      <h2 class="text-2xl font-medium">Connectez-vous <br> tant qu'administrateur</h2>
      <label class="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70">
          <path
            fill-rule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clip-rule="evenodd" />
        </svg>
        <input
          v-model="pin"
          type="password"
          class="grow"
          maxlength="4"
          placeholder="Code PIN (4 chiffres)"
          pattern="[0-9]*"
          inputmode="numeric"
        />
      </label>
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
      <AppButton type="submit" class="btn btn-primary ">
        Connexion
      </AppButton>
    </form>
  </div>
</template>
