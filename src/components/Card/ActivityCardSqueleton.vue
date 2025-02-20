

// ActivityCardSkeleton.vue
<script setup lang="ts">
</script>

<template>
  <div class="card bg-base-100 scale-95 hover:scale-100 transition-all ease-in-out duration-300 shadow-sm">
    <figure class="h-48 skeleton-gradient"></figure>
    <div class="card-body">
      <div class="h-6 w-24 skeleton-gradient rounded"></div>
      <div class="h-8 w-3/4 skeleton-gradient rounded"></div>
      <div class="h-6 w-1/2 skeleton-gradient rounded"></div>
      <div class="h-6 w-1/3 skeleton-gradient rounded"></div>
      <div class="card-actions items-center justify-between">
        <div class="h-8 w-24 skeleton-gradient rounded"></div>
        <div class="h-10 w-28 skeleton-gradient rounded"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-gradient {
  background: linear-gradient(
    110deg,
    #ececec 8%,
    #f5f5f5 18%,
    #ececec 33%
  );
  background-size: 200% 100%;
  animation: 1.5s shine linear infinite;
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>
