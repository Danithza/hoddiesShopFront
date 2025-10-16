<template>
  <v-card
    @click="abrirDetalle"
    class="hover:shadow-lg transition-all cursor-pointer"
  >
    <!-- Imagen del producto -->
    <v-img :src="getImageUrl(product.imageUrl)" height="200" cover></v-img>

    <!-- Datos del producto -->
    <v-card-title>{{ product.name }}</v-card-title>
    <v-card-subtitle>${{ product.price }}</v-card-subtitle>
  </v-card>

  <!-- Modal de detalle del producto -->
  <ProductoDetalle
    v-model="detalleVisible"
    :producto="product"
    @add-to-cart="handleAddToCart"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProductoDetalle from '../components/productoDetalle.vue'
import type { Product } from '@/types/product'

// Props y eventos
const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ (e: 'add-to-cart', product: Product): void }>()

// Estado para controlar el modal
const detalleVisible = ref(false)
const abrirDetalle = () => (detalleVisible.value = true)
const handleAddToCart = (product: Product) => emit('add-to-cart', product)

// ✅ Función para armar correctamente la URL de la imagen
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'
const getImageUrl = (path: string) => {
  if (!path) return `${API_URL}/images/placeholder.jpg`
  if (path.startsWith('http')) return path
  return `${API_URL}${path}`
}
</script>

<style scoped>
.v-card {
  transition: transform 0.3s ease;
}
.v-card:hover {
  transform: translateY(-4px);
}
</style>
