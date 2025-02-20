// stores/adminAuth.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAdminAuth = defineStore('adminAuth', () => {
  const isAdminAuthenticated = ref(false);
  const PIN_CODE = '1234'; // Dans un cas réel, utilisez une méthode plus sécurisée

  // Utilisation de sessionStorage au lieu de localStorage
  const initAuth = () => {
    const stored = sessionStorage.getItem('adminAuth');
    if (stored) {
      isAdminAuthenticated.value = JSON.parse(stored);
    }
  };

  const verifyPin = (pin: string): boolean => {
    const isValid = pin === PIN_CODE;
    if (isValid) {
      isAdminAuthenticated.value = true;
      sessionStorage.setItem('adminAuth', JSON.stringify(true));
    }
    return isValid;
  };

  const logout = () => {
    isAdminAuthenticated.value = false;
    sessionStorage.removeItem('adminAuth');
  };

  return {
    isAdminAuthenticated,
    verifyPin,
    logout,
    initAuth
  };
});
