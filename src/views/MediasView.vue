<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6 text-center">
      Medias Deportivas
    </h1>

    <!-- Loader -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-col>
    </v-row>

    <!-- Productos -->
    <v-row v-else>
      <v-col
        v-for="producto in productos"
        :key="producto.id"
        cols="12"
        sm="6"
        md="4"
      >
        <ProductoCard :product="producto" @add-to-cart="addToCart" />
      </v-col>
    </v-row>

    <!-- Sin productos -->
    <v-row v-if="!loading && productos.length === 0">
      <v-col cols="12" class="text-center text-grey">
        No hay medias deportivas disponibles.
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductoCard from '@/components/ProductoCard.vue'
import { productService } from '@/api/productoServices'
import type { Product } from '@/types/product'

const productos = ref<Product[]>([])
const loading = ref(true)

const obtenerMedias = async () => {
  try {
    productos.value = await productService.getProductsByCategory(3)
  } catch (error) {
    console.error('Error al obtener medias deportivas:', error)
  } finally {
    loading.value = false
  }
}

onMounted(obtenerMedias)

const addToCart = (product: Product) => {
  console.log('🛒 Agregado al carrito:', product.name)
}
</script>

<style scoped>
.v-card {
  transition: transform 0.3s;
}
.v-card:hover {
  transform: translateY(-5px);
}
</style>
