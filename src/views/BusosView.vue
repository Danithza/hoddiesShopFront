<template>
  <v-container>
    <h1 class="text-h4 text-center mb-6">Busos</h1>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"/>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="producto in productos" :key="producto.id" cols="12" sm="6" md="4" lg="3">
        <ProductoCard :product="producto" @add-to-cart="addToCart"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductoCard from '@/components/ProductoCard.vue'
import { productService } from '@/api/productoServices'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const productos = ref<Product[]>([])
const loading = ref(true)

const obtenerBusos = async () => {
  try {
    productos.value = await productService.getProductsByCategory(2)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Función única para agregar al carrito y mostrar en consola
const addToCart = (product: Product) => {
  cartStore.addToCart(product)
  console.log('🛍️ Producto agregado al carrito:', product)
}

onMounted(obtenerBusos)
</script>
