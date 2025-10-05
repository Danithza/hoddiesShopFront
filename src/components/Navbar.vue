<template>
  <v-app-bar :elevation="2" color="primary">
    <v-container class="d-flex align-center">
      <!-- Logo -->
      <v-app-bar-title class="text-h5 font-weight-bold white--text">
        HoddieShop
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navegación -->
      <v-btn
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        color="white"
        class="mx-1"
      >
        {{ item.title }}
      </v-btn>

      <!-- Carrito -->
      <v-btn icon color="white" class="ml-2">
        <v-badge :content="cartItems" color="secondary">
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const navItems = ref([
  { title: 'Inicio', to: '/' },
  { title: 'Productos', to: '/productos' },
  { title: 'Ofertas', to: '/ofertas' },
  { title: 'Contacto', to: '/contacto' }
])

const cartItems = ref(0)
</script>
