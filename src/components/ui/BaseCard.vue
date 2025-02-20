<template>
  <div class="card card-side bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200"
       :class="[size === 'sm' ? 'h-64' : size === 'md' ? 'h-74' : 'h-84']">
    <figure :class="imageWidth">
      <img :src="image" :alt="imageAlt"
           class="h-full w-full max-sm:w-26 object-cover" />
    </figure>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  image: string;
  imageAlt: string;
  size?: 'sm' | 'md' | 'lg';
  imageWidth?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  imageWidth: 'w-1/3 max-w-xs'
});
</script>
