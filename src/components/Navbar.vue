<template>
  <!-- Barra superior -->
  <v-app-bar :elevation="2" color="primary">
    <v-container class="d-flex align-center">
      <!-- Botón menú hamburguesa -->
      <v-btn icon color="white" @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- Logo -->
      <v-app-bar-title class="text-h5 font-weight-bold text-white">
        HoddieShop
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navegación principal -->
      <v-btn
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        variant="text"
        color="white"
        class="mx-1 text-none"
      >
        {{ item.title }}
      </v-btn>

      <!-- Carrito -->
      <v-btn icon color="white" class="ml-2">
        <v-badge :content="cartItems" color="secondary" overlap>
          <template #badge>
            <span v-if="cartItems > 0">{{ cartItems }}</span>
          </template>
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </v-container>
  </v-app-bar>

  <!-- Drawer (menú lateral de categorías) -->
  <v-navigation-drawer v-model="drawer" temporary location="left">
    <v-list>
      <v-list-subheader>Categorías</v-list-subheader>

      <v-list-item
        v-for="cat in categorias"
        :key="cat.title"
        :to="cat.to"
        link
      >
        <v-list-item-title>{{ cat.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)
const cartItems = ref(0)

const navItems = ref([
  { title: 'Inicio', to: '/' },
  { title: 'Productos', to: '/productos' },
  { title: 'Contacto', to: '/contacto' },
])

// Categorías según tu router
const categorias = ref([
  { title: 'Sacos', to: '/sacos' },
  { title: 'Busos', to: '/busos' },
  { title: 'Medias', to: '/medias' },
])
</script>
