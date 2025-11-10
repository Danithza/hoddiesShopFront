<template>
  <v-app-bar color="primary" elevation="0" class="px-4 custom-navbar" height="70">
    <!-- Logo + Hamburguesa -->
    <div class="d-flex align-center">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        color="white"
        class="nav-icon-custom"
        size="small"
        :class="{ 'nav-icon-active': drawer }"
      />

      <router-link to="/" class="text-decoration-none ml-3 logo-custom">
        <div class="d-flex align-center logo-hover">
          <Shirt class="icon-logo text-white" />
          <span class="text-h5 font-weight-black text-white ml-2 logo-text">HODDIES</span>
        </div>
      </router-link>
    </div>

    <v-spacer />

    <!-- Desktop Navigation -->
    <div class="d-none d-md-flex align-center navigation-desktop">
      <v-btn
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        color="white"
        class="mx-1 nav-btn-custom"
        height="44"
        rounded="pill"
        :class="{ 'nav-btn-active': $route.path === item.to }"
      >
        <div class="btn-content">
          <component :is="item.icon" :class="['icon-colored', item.color]" />
          <span class="btn-text">{{ item.title }}</span>
        </div>
      </v-btn>
    </div>

    <v-spacer />

    <!-- Acciones de Usuario -->
    <div class="d-flex align-center actions-container">
      <v-btn
        icon
        color="white"
        @click="cartVisible = true"
        class="mx-2 cart-btn-custom"
        size="large"
        :class="{ 'cart-pulse': cartStore.totalItems > 0 }"
      >
        <div class="cart-container">
          <ShoppingCart class="icon-colored text-yellow-400" />
          <v-badge
            :content="cartStore.totalItems"
            :model-value="cartStore.totalItems > 0"
            color="secondary"
            class="cart-badge"
          />
        </div>
      </v-btn>

      <!-- Usuario -->
      <v-btn
        v-if="user"
        color="white"
        variant="text"
        class="user-btn-custom mx-2 user-glow"
        rounded="pill"
        height="44"
      >
        <div class="user-content">
          <User class="icon-colored text-green-400" />
          <span class="user-name d-none d-sm-inline">{{ user.fullName?.split(' ')[0] }}</span>
        </div>
      </v-btn>

      <!-- 🔹 Botón ingresar corregido -->
      <v-btn
        v-else
        color="white"
        variant="text"
        class="user-btn-custom mx-2 login-btn-custom"
        :to="'/login'"
        rounded="pill"
        height="44"
      >
        <div class="user-content">
          <LogIn class="icon-colored text-blue-400" />
          <span class="user-name">Ingresar</span>
        </div>
      </v-btn>
    </div>

    <CartDialog v-model="cartVisible" />
  </v-app-bar>

  <!-- Drawer -->
  <v-navigation-drawer v-model="drawer" temporary width="320" class="custom-drawer">
    <v-container class="pa-4">
      <!-- Header -->
      <div class="drawer-header text-center mb-6">
        <div class="logo-circle mx-auto mb-3 logo-pulse">
          <Shirt class="icon-logo text-white" style="width:42px;height:42px;" />
        </div>
        <h3 class="text-black font-weight-black mt-1">HODDIES SHOP</h3>
        <p class="text-caption text-grey-darken-1">Tu estilo, nuestra pasión</p>
      </div>

      <!-- Categorías -->
      <div class="categories-section mb-4">
        <h4 class="text-uppercase font-weight-bold text-caption text-grey-darken-1 mb-3">
          Categorías
        </h4>
        <v-row dense>
          <v-col v-for="cat in categorias" :key="cat.title" cols="6" class="pa-2">
            <v-card
              class="category-card-custom rounded-xl"
              @click="openCategory(cat.to)"
              variant="flat"
              height="100"
              :class="{ 'category-card-hover': true }"
            >
              <v-card-text class="text-center pa-3">
                <component :is="cat.icon" class="icon-colored text-indigo-600 category-icon" />
                <div class="category-title text-caption font-weight-bold mt-2 text-black">
                  {{ cat.title }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-6"></v-divider>

      <!-- Acciones Usuario -->
      <div class="user-actions">
        <template v-if="!user">
          <v-btn
            block
            class="btn-gradient mb-3 login-btn-drawer"
            :to="'/login'"
            @click="drawer = false"
            size="large"
            rounded="pill"
          >
            <div class="btn-content text-white">
              <LogIn class="icon-colored text-white" />
              <span>Iniciar Sesión</span>
            </div>
          </v-btn>

          <v-btn
            block
            class="btn-outline-gradient register-btn-drawer"
            :to="'/registro'"
            @click="drawer = false"
            size="large"
            rounded="pill"
          >
            <div class="btn-content text-primary">
              <UserPlus class="icon-colored text-primary" />
              <span>Registrarse</span>
            </div>
          </v-btn>
        </template>

        <template v-else>
          <div class="user-info-custom text-center mb-4 user-info-glow">
            <User class="icon-colored text-indigo-600" style="width:48px;height:48px;" />
            <div class="user-details mt-2">
              <div class="text-body-1 font-weight-bold text-black">{{ user.fullName }}</div>
              <div class="text-caption text-grey-darken-1">{{ user.email }}</div>
            </div>
          </div>
          <v-btn
            block
            class="btn-outline-gradient logout-btn-drawer"
            @click="cerrarSesion"
            size="large"
            rounded="pill"
          >
            <div class="btn-content text-red-600">
              <LogOut class="icon-colored text-red-500" />
              <span>Cerrar Sesión</span>
            </div>
          </v-btn>
        </template>
      </div>
    </v-container>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import axios from 'axios'
import CartDialog from './CartDialog.vue'
import { Home, Shirt, Phone, ShoppingCart, User, LogIn, LogOut, UserPlus } from 'lucide-vue-next'

const drawer = ref(false)
const cartVisible = ref(false)
const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const user = ref<any>(null)

const navItems = [
  { title: 'Inicio', to: '/', icon: Home, color: 'text-blue-400' },
  { title: 'Productos', to: '/productos', icon: Shirt, color: 'text-indigo-400' },
  { title: 'Contacto', to: '/contacto', icon: Phone, color: 'text-green-400' },
]

const categorias = [
  { title: 'Sacos', to: '/sacos', icon: Shirt },
  { title: 'Busos', to: '/busos', icon: Shirt },
  { title: 'Medias', to: '/medias', icon: Shirt },
]

// Computed para ruta activa
const activeRoute = computed(() => route.path)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) user.value = JSON.parse(storedUser)
})

function openCategory(to: string) {
  drawer.value = false
  router.push(to)
}

async function cerrarSesion() {
  try {
    await axios.post('http://localhost:3333/logout', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
  } catch {}
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null
  drawer.value = false
  router.push('/login')
}
</script>

<style scoped>
.custom-drawer {
  background: white;
  color: black;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.logo-circle {
  background: linear-gradient(90deg, #6d28d9, #3b82f6);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease;
}

.logo-pulse:hover {
  animation: pulse 2s infinite;
  transform: scale(1.05);
}

.category-card-custom {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card-hover:hover {
  background: linear-gradient(135deg, #ede9fe, #f3f4f6);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
  border-color: #8b5cf6;
}

.category-card-hover:hover .category-icon {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

.btn-gradient {
  background: linear-gradient(90deg, #6d28d9, #3b82f6);
  color: white !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-outline-gradient {
  border: 2px solid #6d28d9;
  color: #6d28d9 !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-gradient:hover {
  background: #ede9fe;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.icon-logo {
  stroke-width: 2.4;
  transition: all 0.3s ease;
}

.icon-colored {
  width: 20px;
  height: 20px;
  stroke-width: 2.3;
  transition: all 0.3s ease;
}

/* Interactividad mejorada */
.nav-icon-custom {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.nav-icon-active {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.logo-hover:hover .icon-logo {
  transform: rotate(-15deg) scale(1.1);
}

.logo-hover:hover .logo-text {
  background: linear-gradient(90deg, #ffffff, #e5e7eb);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

.nav-btn-custom {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.nav-btn-custom::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-btn-custom:hover::before {
  width: 80%;
}

.nav-btn-active::before {
  width: 80%;
}

.nav-btn-custom:hover .icon-colored {
  transform: scale(1.2) translateY(-2px);
}

.nav-btn-active .icon-colored {
  transform: scale(1.2);
  filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3));
}

.cart-btn-custom {
  position: relative;
  transition: all 0.3s ease;
}

.cart-btn-custom:hover {
  transform: scale(1.1);
}

.cart-pulse .cart-container {
  animation: gentlePulse 2s infinite;
}

.user-btn-custom {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.user-btn-custom:hover {
  transform: translateY(-2px);
}

.user-glow:hover {
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

/* 🔹 Botón ingresar corregido - mismo estilo que los otros */
.login-btn-custom {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.login-btn-custom::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.login-btn-custom:hover::before {
  width: 80%;
}

.login-btn-custom:hover .icon-colored {
  transform: scale(1.2) translateY(-2px);
}

.login-btn-drawer:hover,
.register-btn-drawer:hover,
.logout-btn-drawer:hover {
  transform: translateY(-2px) scale(1.02);
}

.user-info-glow:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

/* Animaciones */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}

@keyframes gentlePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Efectos de transición suaves */
.btn-content, .user-content {
  transition: all 0.3s ease;
}

.nav-btn-custom:hover .btn-content {
  transform: translateY(-1px);
}

.user-btn-custom:hover .user-content {
  transform: translateY(-1px);
}

/* Mejora visual para badges */
.cart-badge {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  80% {
    transform: translateY(-2px);
  }
}
</style>
