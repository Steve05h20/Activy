import { auth } from '@/auth/firebase';
import type { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { defineStore } from 'pinia';
import { reactive, onMounted, onUnmounted, computed } from 'vue';
import { useToastStore } from './toast.store';

export const useAuth = defineStore('auth', () => {
  const toastStore = useToastStore();
  const stateAcount = reactive({
    utilisateur: null as User | null,
    connecte: false,
    email: '',
    pwd: '',
    userName: '',
    loading: false,
    errorMessage: '',
    validationErrors: {
      email: '',
      pwd: '',
      userName: ''
    },
    lastActivity: null as Date | null
  });

  // Surveillance en temps réel de l'état d'authentification
  let unsubscribeAuth: (() => void) | null = null;

  const setupAuthListener = () => {
    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        stateAcount.utilisateur = user;
        stateAcount.connecte = true;
        stateAcount.lastActivity = new Date();
      } else {
        stateAcount.utilisateur = null;
        stateAcount.connecte = false;
        stateAcount.lastActivity = null;
      }
    });
  };

  // Nettoyage de l'écouteur lors de la destruction du store
  const cleanupAuthListener = () => {
    if (unsubscribeAuth) {
      unsubscribeAuth();
      unsubscribeAuth = null;
    }
  };

  // Configuration initiale
  onMounted(() => {
    setupAuthListener();
  });

  // Nettoyage
  onUnmounted(() => {
    cleanupAuthListener();
  });

  // Fonction pour traduire les codes d'erreur Firebase
  const getMessageErreur = (error: FirebaseError) => {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
      'auth/invalid-email': 'L\'adresse email n\'est pas valide',
      'auth/operation-not-allowed': 'Opération non autorisée',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/user-disabled': 'Ce compte utilisateur a été désactivé',
      'auth/user-not-found': 'Email ou mot de passe incorrect',
      'auth/wrong-password': 'Email ou mot de passe incorrect',
      'auth/too-many-requests': 'Trop de tentatives de connexion. Veuillez réessayer plus tard',
      'auth/network-request-failed': 'Erreur de connexion réseau. Vérifiez votre connexion internet',
      'auth/internal-error': 'Erreur interne du serveur',
      'auth/invalid-credential': 'Email ou mot de passe incorrect',
      'auth/invalid-login-credentials': 'Email ou mot de passe incorrect'
    };

    console.log('Firebase error code:', error.code);
    return messages[error.code] || 'Une erreur est survenue lors de la connexion';
  };

  const finallyAction = () => {
    stateAcount.loading = false;
    stateAcount.email = '';
    stateAcount.pwd = '';
    setTimeout(() => {
      stateAcount.errorMessage = '';
    }, 5000);
  };

  // Validation en temps réel
  const validateEmail = (email: string): string => {
    if (!email) return "L'email est requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format d'email invalide";
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Le mot de passe est requis";
    if (password.length < 6) return "Le mot de passe doit contenir au moins 6 caractères";
    if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule";
    if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre";
    return '';
  };

  const validateUserName = (userName: string): string => {
    if (!userName) return "Le nom d'utilisateur est requis";
    if (userName.length < 3) return "Le nom d'utilisateur doit contenir au moins 3 caractères";
    return '';
  };

  // Watchers pour la validation en temps réel
  const updateValidation = () => {
    stateAcount.validationErrors = {
      email: validateEmail(stateAcount.email),
      pwd: validatePassword(stateAcount.pwd),
      userName: validateUserName(stateAcount.userName)
    };
  };

  // Computed properties pour l'état de validation
  const isValid = computed(() => {
    return !stateAcount.validationErrors.email &&
           !stateAcount.validationErrors.pwd &&
           (!stateAcount.validationErrors.userName || !stateAcount.userName);
  });

  // Ajout des méthodes de validation en temps réel
  const validateEmailRealTime = (email: string) => {
    stateAcount.validationErrors.email = validateEmail(email);
  };

  const validatePasswordRealTime = (password: string) => {
    stateAcount.validationErrors.pwd = validatePassword(password);
  };

  const validateUserNameRealTime = (userName: string) => {
    stateAcount.validationErrors.userName = validateUserName(userName);
  };

  // Computed properties pour la validation individuelle
  const isEmailValid = computed(() => !stateAcount.validationErrors.email);
  const isPasswordValid = computed(() => !stateAcount.validationErrors.pwd);
  const isUserNameValid = computed(() => !stateAcount.validationErrors.userName);

  const connecterUtilisateur = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateValidation();

    if (!isValid.value) {
      toastStore.error('Veuillez corriger les erreurs de validation');
      return;
    }

    stateAcount.loading = true;
    stateAcount.errorMessage = '';
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithEmailAndPassword(auth, stateAcount.email, stateAcount.pwd);
      stateAcount.utilisateur = result.user;
      stateAcount.connecte = stateAcount.utilisateur !== null;
      toastStore.success('Connexion réussie !');
    } catch (error) {
      console.error("Erreur de connexion:", error);
      const errorMsg = getMessageErreur(error as FirebaseError);
      stateAcount.errorMessage = errorMsg;
      toastStore.error(errorMsg);
    } finally {
      finallyAction();
    }
  };

  const creerUtilisateur = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateValidation();

    if (!isValid.value || !stateAcount.userName) {
      toastStore.error('Veuillez corriger les erreurs de validation');
      return;
    }

    stateAcount.loading = true;
    stateAcount.errorMessage = '';
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await createUserWithEmailAndPassword(auth, stateAcount.email, stateAcount.pwd);
      stateAcount.utilisateur = result.user;
      stateAcount.connecte = stateAcount.utilisateur !== null;
      await updateProfile(stateAcount.utilisateur, {
        displayName: stateAcount.userName
      });
      toastStore.success('Compte créé avec succès !');
    } catch (error) {
      console.error("Erreur de création de compte:", error);
      const errorMsg = getMessageErreur(error as FirebaseError);
      stateAcount.errorMessage = errorMsg;
      toastStore.error(errorMsg);
    } finally {
      finallyAction();
    }
  };

  const deconnexion = async () => {
    stateAcount.loading = true;
    stateAcount.errorMessage = '';
    try {
      await signOut(auth);
      stateAcount.utilisateur = null;
      stateAcount.connecte = false;
      toastStore.success('Déconnexion réussie');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      const errorMsg = getMessageErreur(error as FirebaseError);
      stateAcount.errorMessage = errorMsg;
      toastStore.error(errorMsg);
    } finally {
      finallyAction();
    }
  };

  return {
    stateAcount,
    creerUtilisateur,
    deconnexion,
    connecterUtilisateur,
    setupAuthListener,
    cleanupAuthListener,
    updateValidation,
    isValid,
    validateEmailRealTime,
    validatePasswordRealTime,
    validateUserNameRealTime,
    isEmailValid,
    isPasswordValid,
    isUserNameValid
  };
});
