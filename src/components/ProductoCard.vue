<template>
  <v-card
    :elevation="hover ? 8 : 2"
    class="product-card mx-auto"
    max-width="300"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <v-img
      :src="product.image_url || '/placeholder-product.jpg'"
      height="200"
      cover
      class="product-image"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-title class="text-h6 font-weight-bold px-4 pt-4 pb-2">
      {{ product.name }}
    </v-card-title>

    <v-card-text class="px-4 pb-2">
      <p class="text-caption text-grey-darken-2 mb-2 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="d-flex justify-space-between align-center mt-4">
        <span class="text-h6 font-weight-bold text-primary">
          ${{ product.price }}
        </span>

        <v-chip
          v-if="product.stock > 0"
          size="small"
          color="success"
          text-color="white"
        >
          En stock
        </v-chip>
        <v-chip v-else size="small" color="error" text-color="white">
          Agotado
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn
        block
        color="secondary"
        variant="flat"
        :disabled="product.stock === 0"
        @click="$emit('add-to-cart', product)"
      >
        <v-icon start>mdi-cart-plus</v-icon>
        Agregar al carrito
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '../types/product'

interface Props {
  product: Product
}

defineProps<Props>()
defineEmits<{
  'add-to-cart': [product: Product]
}>()

const hover = ref(false)
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.product-card:hover {
  transform: translateY(-4px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
