<template>
  <v-app-bar color="primary" elevation="0" class="px-4 custom-navbar" height="70">
    <!-- Logo + Hamburguesa -->
    <div class="d-flex align-center">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        color="white"
        class="nav-icon-custom"
        size="small"
      />

      <router-link to="/" class="text-decoration-none ml-3 logo-custom">
        <div class="d-flex align-center">
          <div class="logo-icon">👕</div>
          <span class="text-h5 font-weight-black text-white ml-2">HOODIE</span>
        </div>
      </router-link>
    </div>

    <v-spacer />

    <!-- Desktop Navigation Mejorado -->
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
      >
        <div class="btn-content">
          <div class="btn-icon">{{ item.icon }}</div>
          <span class="btn-text">{{ item.title }}</span>
        </div>
      </v-btn>
    </div>

    <v-spacer />

    <!-- Acciones de Usuario Mejoradas -->
    <div class="d-flex align-center actions-container">
      <!-- Carrito Mejorado -->
      <v-btn
        icon
        color="white"
        @click="cartVisible = true"
        class="mx-2 cart-btn-custom"
        size="large"
      >
        <div class="cart-container">
          <div class="cart-icon">🛒</div>
          <v-badge
            :content="cartStore.totalItems"
            :model-value="cartStore.totalItems > 0"
            color="secondary"
            class="cart-badge"
          />
        </div>
      </v-btn>

      <!-- Usuario Mejorado -->
      <v-btn
        v-if="user"
        color="white"
        variant="text"
        class="user-btn-custom mx-2"
        rounded="pill"
        height="44"
      >
        <div class="user-content">
          <div class="user-avatar">👤</div>
          <span class="user-name d-none d-sm-inline">{{ user.fullName?.split(' ')[0] }}</span>
        </div>
      </v-btn>

      <v-btn
        v-else
        color="white"
        variant="outlined"
        class="user-btn-custom mx-2"
        :to="'/login'"
        rounded="pill"
        height="44"
      >
        <div class="user-content">
          <div class="user-avatar">🔐</div>
          <span class="user-name">Ingresar</span>
        </div>
      </v-btn>
    </div>

    <CartDialog v-model="cartVisible" />
  </v-app-bar>

  <!-- Drawer Mejorado -->
  <v-navigation-drawer v-model="drawer" temporary width="320" class="custom-drawer">
    <v-container class="pa-4 drawer-container">
      <!-- Header del Drawer -->
      <div class="drawer-header text-center mb-6">
        <div class="drawer-logo">👕</div>
        <h3 class="text-primary font-weight-black mt-2">HOODIE SHOP</h3>
        <p class="text-caption text-grey-darken-1">Tu estilo, nuestra pasión</p>
      </div>

      <!-- Categorías Mejoradas -->
      <div class="categories-section">
        <h4 class="text-uppercase font-weight-bold text-caption text-grey-darken-1 mb-3">Categorías</h4>
        <v-row dense>
          <v-col v-for="cat in categorias" :key="cat.title" cols="6" class="pa-2">
            <v-card
              class="category-card-custom rounded-xl"
              @click="openCategory(cat.to)"
              variant="flat"
              height="100"
            >
              <v-card-text class="text-center pa-3">
                <div class="category-icon-custom">{{ cat.icon }}</div>
                <div class="category-title text-caption font-weight-bold mt-1">{{ cat.title }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-6" />

      <!-- Acciones de Usuario Mejoradas -->
      <div class="user-actions">
        <template v-if="!user">
          <v-btn
            block
            color="primary"
            variant="flat"
            :to="'/login'"
            @click="drawer = false"
            class="mb-3 login-btn-custom"
            size="large"
            rounded="pill"
          >
            <div class="btn-content">
              <div class="btn-icon">🚪</div>
              <span>Iniciar Sesión</span>
            </div>
          </v-btn>
          <v-btn
            block
            color="primary"
            variant="outlined"
            :to="'/registro'"
            @click="drawer = false"
            class="register-btn-custom"
            size="large"
            rounded="pill"
          >
            <div class="btn-content">
              <div class="btn-icon">📝</div>
              <span>Registrarse</span>
            </div>
          </v-btn>
        </template>
        <template v-else>
          <div class="user-info-custom text-center mb-4">
            <div class="user-avatar-large">👤</div>
            <div class="user-details mt-2">
              <div class="text-body-1 font-weight-bold">{{ user.fullName }}</div>
              <div class="text-caption text-grey-darken-2">{{ user.email }}</div>
            </div>
          </div>
          <v-btn
            block
            color="error"
            variant="outlined"
            @click="cerrarSesion"
            class="logout-btn-custom"
            size="large"
            rounded="pill"
          >
            <div class="btn-content">
              <div class="btn-icon">🚪</div>
              <span>Cerrar Sesión</span>
            </div>
          </v-btn>
        </template>
      </div>
    </v-container>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import axios from 'axios'
import CartDialog from './CartDialog.vue'

const drawer = ref(false)
const cartVisible = ref(false)
const router = useRouter()
const cartStore = useCartStore()

const user = ref<any>(null)

const navItems = [
  { title: 'Inicio', to: '/', icon: '🏠' },
  { title: 'Productos', to: '/productos', icon: '👕' },
  { title: 'Contacto', to: '/contacto', icon: '📞' }
]

const categorias = [
  { title: 'Sacos', to: '/sacos', icon: '🧥' },
  { title: 'Busos', to: '/busos', icon: '🦺' },
  { title: 'Medias', to: '/medias', icon: '🧦' }
]

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
    await axios.post("http://localhost:3333/logout", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
  } catch {}
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  user.value = null
  drawer.value = false
  router.push("/login")
}
</script>

<style scoped>
.custom-navbar {
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Logo Styles */
.logo-custom:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.logo-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Navigation Buttons */
.nav-btn-custom {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-btn-custom:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-3px) scale(1.05);
  box-shadow:
    0 8px 25px rgba(255, 255, 255, 0.15),
    0 4px 12px rgba(255, 255, 255, 0.1);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.nav-btn-custom:hover .btn-icon {
  transform: scale(1.2) rotate(5deg);
}

.btn-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Cart Button */
.cart-btn-custom {
  transition: all 0.3s ease !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
}

.cart-btn-custom:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: scale(1.1) rotate(-5deg);
}

.cart-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-icon {
  font-size: 22px;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
}

/* User Button */
.user-btn-custom {
  transition: all 0.3s ease !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-btn-custom:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.user-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  font-size: 18px;
}

.user-name {
  font-weight: 600;
}

/* Drawer Styles */
.custom-drawer {
  border-radius: 0 20px 20px 0;
}

.drawer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.drawer-logo {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(30, 64, 175, 0.3));
}

/* Category Cards */
.category-card-custom {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.category-card-custom::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(30, 64, 175, 0.1), transparent);
  transition: left 0.6s ease;
}

.category-card-custom:hover::before {
  left: 100%;
}

.category-card-custom:hover {
  border-color: #1E40AF;
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%) !important;
  transform: translateY(-5px) scale(1.05);
  box-shadow:
    0 15px 35px rgba(30, 64, 175, 0.15),
    0 5px 15px rgba(30, 64, 175, 0.1);
}

.category-icon-custom {
  font-size: 32px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.category-card-custom:hover .category-icon-custom {
  transform: scale(1.2) rotate(10deg);
  filter: drop-shadow(0 4px 8px rgba(30, 64, 175, 0.3));
}

.category-title {
  color: #374151;
  transition: color 0.3s ease;
}

.category-card-custom:hover .category-title {
  color: #1E40AF;
}

/* User Actions in Drawer */
.user-actions {
  margin-top: auto;
}

.user-avatar-large {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(30, 64, 175, 0.3));
}

.login-btn-custom:hover,
.register-btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 64, 175, 0.3);
}

.logout-btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
}

/* Navigation Desktop Container */
.navigation-desktop {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
}

.actions-container {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 20px;
}
</style>
