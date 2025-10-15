<template>
  <v-app-bar color="primary" :elevation="2">
    <v-container class="d-flex align-center">
      <v-btn icon color="white" @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-app-bar-title class="text-h5 font-weight-bold text-white">HoddieShop</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn v-for="item in navItems" :key="item.title" :to="item.to" variant="text" color="white">
        {{ item.title }}
      </v-btn>

      <v-btn icon color="white" class="ml-2" @click="cartVisible = true">
        <v-badge :content="cartStore.totalItems" color="secondary" overlap>
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>

      <CartDialog v-model="cartVisible" />
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-subheader>Categorías</v-list-subheader>
      <v-list-item v-for="cat in categorias" :key="cat.title" :to="cat.to" link>
        <v-list-item-title>{{ cat.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import CartDialog from './CartDialog.vue'

const drawer = ref(false)
const cartVisible = ref(false)
const cartStore = useCartStore()

const navItems = [
  { title: 'Inicio', to: '/' },
  { title: 'Productos', to: '/productos' },
  { title: 'Contacto', to: '/contacto' }
]

const categorias = [
  { title: 'Sacos', to: '/sacos' },
  { title: 'Busos', to: '/busos' },
  { title: 'Medias', to: '/medias' }
]
</script>
