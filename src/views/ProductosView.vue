<template>
  <v-main>
    <v-container class="py-8">
      <!-- Header -->
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold text-primary mb-2">
            Nuestros Productos
          </h1>
          <p class="text-h6 text-grey-darken-2">
            Explora nuestra completa colección de hoodies, buzos y medias
          </p>
        </v-col>
      </v-row>

      <!-- Filtros -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            label="Buscar productos..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="categoryFilter"
            :items="categories"
            label="Categoría"
            variant="outlined"
            hide-details
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Ordenar por"
            variant="outlined"
            hide-details
          ></v-select>
        </v-col>
      </v-row>

      <!-- Product Grid -->
      <v-row v-if="loading">
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="image, heading, text, button"></v-skeleton-loader>
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
          <ProductoCard
            :product="product"
            @add-to-cart="addToCart"
          />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-if="!loading && filteredProducts.length === 0">
        <v-col cols="12" class="text-center py-16">
          <v-icon size="96" color="grey-lighten-2" class="mb-4">mdi-package-variant</v-icon>
          <h3 class="text-h5 text-grey-darken-2 mb-2">No se encontraron productos</h3>
          <p class="text-grey-darken-1">Intenta con otros filtros de búsqueda</p>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-if="error">
        <v-col cols="12" class="text-center">
          <v-alert type="error" variant="tonal">
            {{ error }}
          </v-alert>
          <v-btn color="primary" @click="fetchProducts" class="mt-4">
            Reintentar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import ProductoCard from '../components/ProductoCard.vue'
import type { Product } from '../types/product'

const productStore = useProductStore()
const { products, loading, error, fetchProducts } = productStore

// Filtros y búsqueda
const search = ref('')
const categoryFilter = ref('')
const sortBy = ref('name')

const categories = [
  { title: 'Hoodies', value: 'hoodies' },
  { title: 'Buzos', value: 'buzos' },
  { title: 'Medias', value: 'medias' }
]

const sortOptions = [
  { title: 'Nombre', value: 'name' },
  { title: 'Precio: Menor a Mayor', value: 'price_asc' },
  { title: 'Precio: Mayor a Menor', value: 'price_desc' }
]

const filteredProducts = computed((): Product[] => {
  // CORRECCIÓN: products ya es un ref, así que usamos products directamente
  let filtered = [...products]

  // Filtro por búsqueda
  if (search.value) {
    filtered = filtered.filter((product: Product) =>
      product.name.toLowerCase().includes(search.value.toLowerCase()) ||
      product.description.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  // Filtro por categoría (simulado basado en nombre)
  if (categoryFilter.value) {
    filtered = filtered.filter((product: Product) =>
      product.name.toLowerCase().includes(categoryFilter.value.toLowerCase())
    )
  }

  // Ordenamiento con tipos correctos
  if (sortBy.value === 'name') {
    filtered.sort((a: Product, b: Product) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'price_asc') {
    filtered.sort((a: Product, b: Product) => a.price - b.price)
  } else if (sortBy.value === 'price_desc') {
    filtered.sort((a: Product, b: Product) => b.price - a.price)
  }

  return filtered
})

onMounted(() => {
  fetchProducts()
})

const addToCart = (product: Product): void => {
  // Lógica para agregar al carrito
  console.log('Agregar al carrito:', product)
  // Aquí puedes implementar la lógica real del carrito
}
</script>
