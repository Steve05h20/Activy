<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
}

defineProps<Props>();
</script>

<template>
  <div class="card bg-base-200 shadow-xl">
    <div class="card-body items-center text-center">
      <h3 class="card-title text-xl mb-2">{{ title }}</h3>
      <p class="text-base-content/70">{{ description }}</p>
      <div class="card-actions mt-4">
        <router-link :to="actionRoute" class="btn btn-primary">
          {{ actionLabel }}
        </router-link>
      </div>
    </div>
  </div>
</template>
