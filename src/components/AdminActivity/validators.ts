import type { TypeAcitivity } from '@/interface/activity.type';
import { helpers } from '@vuelidate/validators';


export type ValidationType = 'required' | 'minLength' | 'maxLength' | 'minValue' | 'url';
export type ValidationMessages = Record<ValidationType, string>;

export const validationMessages: ValidationMessages = {
  required: 'Ce champ est requis',
  minLength: 'Minimum 3 caractères requis',
  maxLength: 'Maximum 50 caractères autorisés',
  minValue: 'La valeur doit être positive',
  url: 'Format URL invalide'
};

export const urlValidator = helpers.regex(/^https?:\/\/.+/);

export const activityTypes: TypeAcitivity[] = ['Danse', 'Fitness', 'Raquette', 'Randonnée', 'Kayak'];
