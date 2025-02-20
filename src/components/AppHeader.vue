<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, computed } from "vue"
import { useAuth } from '@/stores/auth.store'
import type { RouteRecordRaw } from 'vue-router'
import { useAdminAuth } from '@/stores/authAdmin.store'
import UserProfile from './navigation/UserProfile.vue'
import NavLink from './navigation/NavLink.vue'
import CartIcon from './navigation/CartIcon.vue'
import AppButton from './ui/AppButton.vue'

// Constants
const MOBILE_BREAKPOINT = 640
const AUTH_PATHS = ['inscription', 'connexion']
const HIDDEN_ADMIN_PATHS = ['Adherent', 'S\'inscrire', 'Se connecter']
const ADMIN_PATH = 'Admin'

// Composables
const router = useRouter()
const routesList = router.getRoutes()
const { stateAcount } = useAuth()
const adminStore = useAdminAuth()

// Reactive state
const isMenuOpen = ref(false)

// Computed properties
const filteredRoutes = computed(() => {
  const mainRoutes = filterMainRoutes(routesList)
  return filterRoutesByType(mainRoutes)
})

const normalRoutes = computed(() => filteredRoutes.value.normalRoutes)
const authRoutes = computed(() => filteredRoutes.value.authRoutes)

// Methods
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value

// Route filtering
const filterMainRoutes = (routes: RouteRecordRaw[]) => {
  return routes.filter(route => {
    return route.path.split('/').length <= 2 &&
           !route.path.includes("login") &&
           route.name &&
           route.path !== ''
  })
}

const filterRoutesByType = (routes: RouteRecordRaw[]) => {
  const authRoutes = routes.filter(route =>
    AUTH_PATHS.some(path => route.path.includes(path))
  )

  const normalRoutes = routes.filter(route => {
    if (stateAcount.connecte && route.name === ADMIN_PATH) {
      return false
    }

    if (adminStore.isAdminAuthenticated &&
        HIDDEN_ADMIN_PATHS.includes(route.name as string)) {
      return false
    }

    return !AUTH_PATHS.some(path => route.path.includes(path))
  })

  return { authRoutes, normalRoutes }
}

// Window resize handler
const handleResize = () => {
  if (window.innerWidth > MOBILE_BREAKPOINT && isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header class="bg-white h-15">
    <AppButton
      class="sm:hidden"
      :class="{ 'open': isMenuOpen }"
      @click="toggleMenu"
    >
      {{ isMenuOpen ? 'X' : 'Menu' }}
    </AppButton>

    <nav
      class="flex items-center justify-center max-sm:flex-col max-sm:justify-start max-sm:items-start transition-all duration-500 bg-white rounded-lg"
      :class="{
        'max-sm:-translate-x-0 max-sm:text-4xl max-sm:h-screen': isMenuOpen,
        'max-sm:-translate-x-150': !isMenuOpen
      }"
    >
      <!-- Normal routes -->
      <template v-for="route in normalRoutes" :key="route.name">
        <NavLink
          :to="route.path"
          :onClick="toggleMenu"
        >
          {{ route.name }}
          <CartIcon v-if="route.name === 'Adherent' && stateAcount.connecte" />
        </NavLink>
      </template>

      <!-- Auth routes -->
      <template v-if="!stateAcount.connecte && !adminStore.isAdminAuthenticated">
        <NavLink
          v-for="route in authRoutes"
          :key="route.name"
          :to="route.path"
          :onClick="toggleMenu"
        >
          {{ route.name }}
        </NavLink>
      </template>

      <!-- User Profile -->
      <UserProfile v-if="stateAcount.connecte" />
    </nav>
  </header>
</template>

<style scoped>
.relative {
  position: relative;
}
</style>
