<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue';
import ActionButton from '@/components/ui/ActionButton.vue';
import { formatDate } from '@/pipes/datePipe';
import type { IActivity } from '@/interface/activity.type';

interface CartActivityProps {
  item: IActivity;
  onRemove: (id: string | undefined) => void;
}

defineProps<CartActivityProps>();

const ICONS = {
  delete: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
};
</script>

<template>
  <BaseCard
    :image="item.image"
    :image-alt="item.titre"
    size="md"
  >
    <div class="flex flex-col md:flex-row justify-between items-start gap-4">
      <div>
        <h3 class="card-title text-xl">{{ item.titre }}</h3>
        <div class="badge badge-primary mt-2">{{ item.type }}</div>
        <div class="mt-4 space-y-1 text-base-content/80">
          <p>Date: {{ formatDate(item.date) }}</p>
          <p>Heure: {{ item.heure }}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-primary">{{ item.cout }}$</p>
        <div class="flex flex-col gap-2 mt-4">
          <ActionButton
            variant="error"
            :icon="ICONS.delete"
            @click="onRemove(item._id)"
          >
            Supprimer
          </ActionButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
