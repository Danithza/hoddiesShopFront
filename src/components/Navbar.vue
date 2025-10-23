<template>
  <v-app-bar color="primary" :elevation="6" class="px-3">
    <!-- Logo y Menú Hamburguesa -->
    <div class="d-flex align-center">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        color="white"
        class="mr-3"
        size="small"
      >
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <router-link to="/" class="text-decoration-none">
        <div class="d-flex align-center">
          <v-avatar color="white" size="40" class="mr-3">
            <v-icon color="primary" size="24">mdi-hoodie</v-icon>
          </v-avatar>
          <div>
            <span class="text-h5 font-weight-bold text-white d-block">
              HoodieShop
            </span>
            <span class="text-caption text-white d-none d-sm-block" style="opacity: 0.8;">
              Style & Comfort
            </span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Navegación Desktop -->
    <div class="d-none d-md-flex align-center ml-8 navigation-desktop">
      <v-btn
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        color="white"
        class="mx-1 navigation-btn"
        rounded="lg"
        height="40"
      >
        <v-icon size="18" class="mr-2">{{ item.icon }}</v-icon>
        {{ item.title }}
        <v-ripple></v-ripple>
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <!-- Acciones de usuario -->
    <div class="d-flex align-center gap-2">
      <!-- Menú de usuario -->
      <v-menu v-model="userMenu" location="bottom end" transition="scale-transition">
        <template #activator="{ props }">
          <v-btn
            color="white"
            variant="text"
            class="user-btn"
            v-bind="props"
            rounded="lg"
            height="40"
          >
            <v-avatar v-if="user" size="28" color="white" class="mr-2">
              <span class="text-primary font-weight-bold text-caption">
                {{ userInicial }}
              </span>
            </v-avatar>
            <v-icon v-else class="mr-1">mdi-account-circle</v-icon>

            <span class="d-none d-md-inline user-name">
              {{ user ? user.fullName?.split(' ')[0] : 'Cuenta' }}
            </span>
            <v-icon end size="small" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-card min-width="240" elevation="12" rounded="lg" class="user-menu-card">
          <v-list nav class="py-3">
            <template v-if="!user">
              <v-list-item
                :to="'/login'"
                prepend-icon="mdi-login"
                title="Iniciar Sesión"
                value="login"
                class="my-1 menu-item"
                @click="userMenu = false"
              >
                <template #prepend>
                  <v-icon color="primary">mdi-login</v-icon>
                </template>
              </v-list-item>
              <v-list-item
                :to="'/registro'"
                prepend-icon="mdi-account-plus"
                title="Registrarse"
                value="register"
                class="my-1 menu-item"
                @click="userMenu = false"
              >
                <template #prepend>
                  <v-icon color="primary">mdi-account-plus</v-icon>
                </template>
              </v-list-item>
            </template>

            <template v-else>
              <v-list-item class="my-2 user-info">
                <template #prepend>
                  <v-avatar size="40" color="primary" class="mr-3">
                    <span class="text-white font-weight-bold">
                      {{ userInicial }}
                    </span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold text-primary">
                  {{ user.fullName }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ user.email }}</v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item
                @click="cerrarSesion"
                prepend-icon="mdi-logout"
                title="Cerrar sesión"
                value="logout"
                color="error"
                class="my-1 menu-item"
              >
                <template #prepend>
                  <v-icon color="error">mdi-logout</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-menu>

      <!-- Carrito -->
      <v-btn
        icon
        color="white"
        @click="cartVisible = true"
        class="cart-btn mx-1"
        size="small"
        rounded="lg"
      >
        <v-badge
          :content="cartStore.totalItems"
          :model-value="cartStore.totalItems > 0"
          color="secondary"
          overlap
          bordered
        >
          <v-icon size="26">mdi-shopping</v-icon>
        </v-badge>
      </v-btn>
    </div>

    <CartDialog v-model="cartVisible" />
  </v-app-bar>

  <!-- Drawer lateral PRO -->
  <v-navigation-drawer v-model="drawer" temporary width="320">
    <v-card height="100%" class="drawer-card">
      <!-- Header del drawer -->
      <v-card-title class="drawer-header">
        <div class="d-flex align-center w-100">
          <v-avatar color="primary" size="48" class="mr-3">
            <v-icon color="white" size="28">mdi-hoodie</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold text-primary">HoodieShop</div>
            <div class="text-caption text-medium-emphasis">Style & Comfort</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="drawer = false"
            variant="text"
            size="small"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider class="my-2"></v-divider>

      <!-- Contenido del drawer -->
      <v-card-text class="pa-0">
        <v-list class="pa-3">
          <!-- Navegación principal -->
          <v-list-subheader class="text-uppercase font-weight-bold text-caption text-medium-emphasis pl-0">
            Navegación
          </v-list-subheader>
          <v-list-item
            v-for="item in navItems"
            :key="item.title"
            :to="item.to"
            @click="drawer = false"
            class="my-1 rounded-xl drawer-item"
            variant="flat"
            height="52"
          >
            <template #prepend>
              <v-icon :color="item.to === $route.path ? 'primary' : ''">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
            <v-icon end size="small" color="grey-lighten-1">mdi-chevron-right</v-icon>
          </v-list-item>

          <v-divider class="my-4"></v-divider>

          <!-- Categorías -->
          <v-list-subheader class="text-uppercase font-weight-bold text-caption text-medium-emphasis pl-0">
            Categorías
          </v-list-subheader>
          <v-list-item
            v-for="cat in categorias"
            :key="cat.title"
            :to="cat.to"
            @click="drawer = false"
            class="my-1 rounded-xl drawer-item"
            variant="flat"
            height="52"
          >
            <template #prepend>
              <v-icon color="grey-darken-1">mdi-tag-outline</v-icon>
            </template>
            <v-list-item-title>{{ cat.title }}</v-list-item-title>
            <v-icon end size="small" color="grey-lighten-1">mdi-chevron-right</v-icon>
          </v-list-item>
        </v-list>
      </v-card-text>

      <!-- Footer del drawer -->
      <v-card-actions class="drawer-footer pa-4">
        <template v-if="!user">
          <v-btn
            :to="'/login'"
            color="primary"
            variant="flat"
            block
            class="mb-2"
            @click="drawer = false"
            size="large"
          >
            <v-icon start>mdi-login</v-icon>
            Iniciar Sesión
          </v-btn>
          <v-btn
            :to="'/registro'"
            color="primary"
            variant="outlined"
            block
            @click="drawer = false"
            size="large"
          >
            Registrarse
          </v-btn>
        </template>
        <template v-else>
          <div class="w-100">
            <div class="d-flex align-center mb-3">
              <v-avatar size="40" color="primary" class="mr-3">
                <span class="text-white font-weight-bold">{{ userInicial }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-bold">{{ user.fullName }}</div>
                <div class="text-caption text-medium-emphasis">{{ user.email }}</div>
              </div>
            </div>
            <v-btn
              @click="cerrarSesion"
              color="error"
              variant="outlined"
              block
            >
              <v-icon start>mdi-logout</v-icon>
              Cerrar Sesión
            </v-btn>
          </div>
        </template>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import CartDialog from './CartDialog.vue'
import axios from 'axios'

const drawer = ref(false)
const cartVisible = ref(false)
const userMenu = ref(false)
const cartStore = useCartStore()
const router = useRouter()

// Estado del usuario
const user = ref<any>(null)

const navItems = [
  { title: 'Inicio', to: '/', icon: 'mdi-home' },
  { title: 'Productos', to: '/productos', icon: 'mdi-shopping' },
  { title: 'Contacto', to: '/contacto', icon: 'mdi-email' }
]

const categorias = [
  { title: 'Sacos', to: '/sacos' },
  { title: 'Busos', to: '/busos' },
  { title: 'Medias', to: '/medias' }
]

// Inicial del nombre
const userInicial = computed(() => {
  return user.value?.fullName?.[0]?.toUpperCase() || 'U'
})

// Cargar usuario si hay token guardado
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  const token = localStorage.getItem('token')

  if (storedUser && token) {
    user.value = JSON.parse(storedUser)
  }
})

// Cerrar sesión
async function cerrarSesion() {
  try {
    await axios.post('http://localhost:3333/logout', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  } catch (e) {
    console.error('Error cerrando sesión:', e)
  }

  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null
  userMenu.value = false
  drawer.value = false
  router.push('/login')
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

/* Estilos PRO para el navbar */
.navigation-desktop {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 24px;
}

.navigation-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.navigation-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1) !important;
}

.user-btn {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.user-btn:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1) !important;
}

.user-name {
  font-weight: 500;
}

.cart-btn {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.cart-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Drawer styles */
.drawer-card {
  border-radius: 0 24px 24px 0;
}

.drawer-header {
  background: linear-gradient(135deg, var(--v-theme-primary), var(--v-theme-primary-darken-1));
  padding: 24px;
}

.drawer-header .text-primary {
  color: white !important;
}

.drawer-item {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.drawer-item:hover {
  border-color: var(--v-theme-primary);
  transform: translateX(4px);
}

.drawer-item:active {
  transform: translateX(4px) scale(0.98);
}

.drawer-footer {
  background: rgba(var(--v-theme-primary), 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* User menu card */
.user-menu-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.menu-item {
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

.user-info {
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 12px;
}

/* Badge styles */
.v-badge__badge {
  font-size: 0.65rem;
  height: 18px;
  min-width: 18px;
  font-weight: 700;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .v-app-bar {
    padding-left: 8px;
    padding-right: 8px;
  }

  .user-btn {
    min-width: auto !important;
  }
}
</style>
