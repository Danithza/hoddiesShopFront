<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold text-primary mb-6">Busos</h1>

    <v-row v-if="store.loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="product in filteredProducts"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductoCard :product="product" @add-to-cart="addToCart" />
      </v-col>
    </v-row>

    <v-row v-if="!store.loading && filteredProducts.length === 0">
      <v-col cols="12" class="text-center text-grey">
        No hay busos disponibles.
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductoCard from '@/components/ProductoCard.vue'

const store = useProductStore()

onMounted(() => {
  store.fetchProducts()
})

const filteredProducts = computed(() =>
  store.products.filter(p => p.category_id === 2)
)


const addToCart = (product: any) => {
  console.log('Agregado al carrito:', product)
}
</script>
