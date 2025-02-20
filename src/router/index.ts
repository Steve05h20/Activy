import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'
import AuthSignIn from '@/auth/AuthSign-in.vue'
import AuthSignUp from '@/auth/AuthSign-up.vue'
import AdminActivity from '@/components/AdminActivity/AdminActivity.vue'
import AuthAdmin from '@/auth/AuthAdmin.vue'
import AdminUser from '@/components/AdminUser/AdminUser.vue'
import AdherentView from "@/views/AdherentView.vue"

import { useAdminAuth } from '@/stores/authAdmin.store'
import { useAuth } from "@/stores/auth.store"
import { storeToRefs } from 'pinia'

// Configuration des routes
const routes = [
  {
    path: '/',
    name: 'Activy',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/activity',
        meta: { requiresAdmin: true }
      },
      {
        path: 'activity',
        name: 'activity',
        component: AdminActivity,
        meta: { requiresAdmin: true }
      },
      {
        path: 'User',
        name: 'user',
        component: AdminUser,
        meta: { requiresAdmin: true }
      },
      {
        path: '/admin/Seance',
        name: 'AdminSeance',
        component: () => import('@/components/AdminSeance/AdminSeance.vue')
      }
    ]
  },
  {
    path: '/adherent',
    name: 'Adherent',
    component: AdherentView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AuthAdmin
  },
  {
    path: '/inscription',
    name: "S'inscrire",
    component: AuthSignUp
  },
  {
    path: '/connexion',
    name: 'Se connecter',
    component: AuthSignIn
  },

]

// Création du router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Garde de navigation
router.beforeEach(async (to, from, next) => {
  const auth = useAuth()
  const { stateAcount } = storeToRefs(auth)
  const adminAuth = useAdminAuth()

  // Vérifier si la route nécessite une authentification adhérent
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!stateAcount.value.connecte) {
      // Sauvegarder la route cible pour rediriger après connexion
      sessionStorage.setItem('redirectAfterLogin', to.fullPath)
      next({ name: 'Se connecter' })
      return
    }
  }

  // Vérifier si la route nécessite une authentification admin
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!adminAuth.isAdminAuthenticated) {
      next({ name: 'AdminLogin' })
      return
    }
  }

  next()
})

export default router
