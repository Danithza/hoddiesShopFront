<template>
  <v-card @click="abrirDetalle" class="hover:shadow-lg transition-all cursor-pointer">
    <v-img :src="product.image_url" height="200" cover></v-img>
    <v-card-title>{{ product.name }}</v-card-title>
    <v-card-subtitle>${{ product.price }}</v-card-subtitle>
  </v-card>

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

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ (e: 'add-to-cart', product: Product): void }>()

const detalleVisible = ref(false)

const abrirDetalle = () => {
  detalleVisible.value = true
}

const handleAddToCart = (product: Product) => {
  emit('add-to-cart', product)
}
</script>
