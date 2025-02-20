<template>
  <div class="badge" :class="[
    status === 'payée' ? 'badge-success' :
    status === 'annulée' ? 'badge-error' :
    'badge-warning'
  ]">
    {{ status }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  status: 'payée' | 'annulée' | 'en_attente';
}

defineProps<Props>();
</script>
