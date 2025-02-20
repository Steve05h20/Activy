<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import { useAuth } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const { stateAcount, deconnexion } = useAuth()
const router = useRouter()

const handleDeconnexion = async () => {
  try {
    await deconnexion()
    router.push('/')
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <AppButton class="flex items-center justify-center min-w-38">
      <img
        src="/src/assets/avatar.png"
        alt="Avatar Utilisateur"
        class="h-6 mx-2 rounded-full"
      />
      {{ stateAcount.utilisateur?.displayName }}
    </AppButton>

    <AppButton
      @click="handleDeconnexion"
      class="btn flex items-center justify-center min-w-38"
    >
      Se déconnecter
    </AppButton>
  </div>
</template>
