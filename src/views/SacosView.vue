<template>
  <v-container class="py-10">
    <h1 class="text-h4 font-weight-bold mb-6 text-center">Sacos</h1>

    <!-- Mostrar productos -->
    <v-row v-if="productos.length > 0" dense>
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

    <!-- Mensaje si no hay productos -->
    <v-row v-else align="center" justify="center">
      <v-col cols="12" class="text-center py-16">
        <v-icon size="80" color="grey-lighten-1">mdi-package-variant</v-icon>
        <p class="text-grey-darken-1 text-h6 mt-4">
          No hay sacos disponibles actualmente.
        </p>
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

const obtenerSacos = async () => {
  try {
    productos.value = await productService.getProductsByCategory(1) // ID 1 = Sacos
  } catch (error) {
    console.error('Error al obtener los sacos:', error)
  }
}

onMounted(obtenerSacos)

const addToCart = (product: Product) => {
  console.log('🛒 Agregado al carrito:', product.name)
  // Aquí puedes conectar con tu store de carrito
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
