<script setup lang="ts">
defineProps<{
  amount: number;
}>();

const formatPrice = (amount: number) => {
  return `${amount.toFixed(2)}$`;
};
</script>

<template>
  <span class="font-medium">
    {{ formatPrice(amount) }}
  </span>
</template>
