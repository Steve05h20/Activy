<script lang="ts" setup>
import { useActivities } from '@/stores/activity.store';
import { reactive, computed, watch } from 'vue';
import { useVuelidate, type ValidationArgs } from '@vuelidate/core';
import { minLength, maxLength, minValue, required, helpers } from '@vuelidate/validators';


import { validationMessages, urlValidator, activityTypes } from './validators';
import TableRowLabelWrapper from './TableRowLabelWrapper.vue';
import type { IActivity } from '@/interface/activity.type';
import TableRowInputWrapper from './TableRowInputWrapper.vue';
import AppButton from '../ui/AppButton.vue';


const activityStore = useActivities();
const props = defineProps<{ activity: IActivity | null }>();
const emit = defineEmits(['activityUpdated']);

const activityData = reactive<IActivity>({
  titre: '',
  type: 'Danse',
  cout: 0,
  date: new Date().toISOString().split('T')[0], // Initialize as string
  heure: '',
  image: ''
});

watch(() => props.activity, (newActivity) => {
  if (newActivity) {
    Object.assign(activityData, newActivity);
    activityData.date = new Date(newActivity.date).toISOString().split('T')[0]; // Format the date as string
  }
});

const rules = {
  titre: {
    required: helpers.withMessage(validationMessages.required, required),
    minLength: helpers.withMessage(validationMessages.minLength, minLength(3)),
    maxLength: helpers.withMessage(validationMessages.maxLength, maxLength(50))
  },
  type: {
    required: helpers.withMessage(validationMessages.required, required)
  },
  cout: {
    required: helpers.withMessage(validationMessages.required, required),
    minValue: helpers.withMessage(validationMessages.minValue, minValue(0))
  },
  date: {
    required: helpers.withMessage(validationMessages.required, required)
  },
  heure: {
    required: helpers.withMessage(validationMessages.required, required)
  },
  image: {
    required: helpers.withMessage(validationMessages.required, required),
    url: helpers.withMessage(validationMessages.url, urlValidator)
  }
};

const v$ = useVuelidate(rules, activityData);

const isFormValid = computed(() => {
  return !v$.value.$invalid &&
    activityData.titre &&
    activityData.type &&
    activityData.date &&
    activityData.heure &&
    activityData.image;
});

const getErrorMessage = (errors: ValidationArgs[]): string => {
  if (!errors.length) return '';
  return (errors[0] as { $message: string }).$message;
};

const resetForm = () => {
  activityData.titre = '';
  activityData.type = 'Danse';
  activityData.cout = 0;
  activityData.date = new Date().toISOString().split('T')[0]; // Format the date as string
  activityData.heure = '';
  activityData.image = '';
  v$.value.$reset();
};

const gestionData = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  try {
    if (props.activity && props.activity._id) {
      await activityStore.editActivity(props.activity._id, activityData);
    } else {
      await activityStore.addActivity({
        ...activityData,
        date: new Date(activityData.date).toISOString() // Ensure date is in ISO format
      });
    }

    resetForm();
    emit('activityUpdated');
  } catch (error) {
    console.error("Erreur lors de l'ajout ou de la modification de l'activité:", error);
  }
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    <TableRowInputWrapper label="Titre">
      <input
        type="text"
        placeholder="Titre"
        class="input input-bordered input-xs w-full"
        :class="{ 'input-error': v$.titre.$error }"
        v-model="activityData.titre"
        @blur="v$.titre.$touch"
      />
      <TableRowLabelWrapper :vif="v$.titre.$error">
        {{ getErrorMessage(v$.titre.$errors) }}
      </TableRowLabelWrapper>
    </TableRowInputWrapper>

    <TableRowInputWrapper label="Type">
      <select
        v-model="activityData.type"
        class="select select-bordered input-xs w-full"
        :class="{ 'select-error': v$.type.$error }"
        @blur="v$.type.$touch"
      >
        <option disabled value="">Sélectionnez un type</option>
        <option v-for="type in activityTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
      <TableRowLabelWrapper :vif="v$.type.$error">
        {{ getErrorMessage(v$.type.$errors) }}
      </TableRowLabelWrapper>
    </TableRowInputWrapper>

    <TableRowInputWrapper label="Date">
      <input
        type="date"
        class="custom-date-input w-full"
        :class="{ 'input-error': v$.date.$error }"
        v-model="activityData.date"
        @blur="v$.date.$touch"
        :min="new Date().toISOString().split('T')[0]"
      />
      <TableRowLabelWrapper :vif="v$.date.$error">
        {{ getErrorMessage(v$.date.$errors) }}
      </TableRowLabelWrapper>
    </TableRowInputWrapper>

    <TableRowInputWrapper label="Heure">
      <input
        type="time"
        class="custom-time-input w-full"
        :class="{ 'input-error': v$.heure.$error }"
        v-model="activityData.heure"
        @blur="v$.heure.$touch"
        step="900"
      />
      <TableRowLabelWrapper :vif="v$.heure.$error">
        {{ getErrorMessage(v$.heure.$errors) }}
      </TableRowLabelWrapper>
    </TableRowInputWrapper>

    <TableRowInputWrapper label="Coût">
      <input
        type="number"
        class="input input-bordered input-xs w-full"
        :class="{ 'input-error': v$.cout.$error }"
        v-model="activityData.cout"
        @blur="v$.cout.$touch"
      />
      <TableRowLabelWrapper :vif="v$.cout.$error">
        {{ getErrorMessage(v$.cout.$errors) }}
      </TableRowLabelWrapper>
    </TableRowInputWrapper>

    <TableRowInputWrapper label="Lien de l'image">
      <input
        type="text"
        placeholder="Lien de l'image"
        class="input input-bordered input-xs w-full"
        :class="{ 'input-error': v$.image.$error }"
        v-model="activityData.image"
        @blur="v$.image.$touch"
      />
      <TableRowLabelWrapper :vif="v$.image.$error">
        {{ getErrorMessage(v$.image.$errors) }}
      </TableRowLabelWrapper>
    </TableRowInputWrapper>

    <div class="col-span-full">
      <AppButton
        @click="gestionData"
        class="btn btn-primary w-full"
        :disabled="!isFormValid"
      >
        {{ props.activity ? 'Modifier' : 'Ajouter' }}
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.custom-date-input,
.custom-time-input {
  appearance: none;
  -webkit-appearance: none;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1f2937;
  width: 100%;
  height: 24px;
}

.custom-date-input:focus,
.custom-time-input:focus {
  outline: 2px solid #2563eb;
  outline-offset: -1px;
  border-color: transparent;
}

.custom-date-input::-webkit-calendar-picker-indicator,
.custom-time-input::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 8px;
  cursor: pointer;
  filter: invert(0.5);
  opacity: 1;
  width: 16px;
  height: 16px;
}

.custom-date-input[type="date"],
.custom-time-input[type="time"] {
  position: relative;
  padding-right: 30px;
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  outline-color: #ef4444;
}
</style>
