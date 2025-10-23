<template>
  <v-main>
    <v-container class="py-8">
      <!-- Header -->
      <v-row class="justify-space-between align-center mb-6">
        <v-col cols="auto">
          <h1 class="text-h3 font-weight-bold text-primary">Nuestros Productos</h1>
          <p class="text-h6 text-grey-darken-2">Explora nuestra colección</p>
        </v-col>
        <v-col cols="auto">
          <v-badge :content="cartStore.totalItems" color="primary" overlap>
            <v-btn icon size="large" color="primary" @click="showCart = true">
              <v-icon>mdi-cart</v-icon>
            </v-btn>
          </v-badge>
        </v-col>
      </v-row>

      <!-- Filtros -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-text-field v-model="search" label="Buscar..." prepend-inner-icon="mdi-magnify" variant="outlined" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="categoryFilter" :items="categories" label="Categoría" variant="outlined" clearable hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="sortBy" :items="sortOptions" label="Ordenar por" variant="outlined" hide-details />
        </v-col>
      </v-row>

      <!-- Contenido -->
      <v-row v-if="loading">
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="image, heading, text, button" />
        </v-col>
      </v-row>

      <v-row v-else-if="filteredProducts.length">
        <v-col v-for="p in filteredProducts" :key="p.id" cols="12" sm="6" md="4" lg="3">
          <v-card class="pa-4 text-center product-card" elevation="8">
            <v-img :src="getImageUrl(p.imageUrl)" height="220" cover class="rounded-lg mb-3 cursor-pointer" @click="goToProduct(p.id)" />
            <h3 class="text-h6 font-weight-bold text-primary">{{ p.name }}</h3>
            <p class="text-h6 text-grey-darken-1 mb-3">${{ p.price }}</p>
            <div class="d-flex gap-2">
              <v-btn color="secondary" variant="outlined" @click="goToProduct(p.id)" class="flex-grow-1">Ver detalle</v-btn>
              <v-btn color="primary" variant="flat" @click="addToCart(p)" class="flex-grow-1">
                <v-icon left>mdi-cart-plus</v-icon> Agregar
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" class="text-center py-16">
          <v-icon size="96" color="grey-lighten-2" class="mb-4">mdi-package-variant</v-icon>
          <h3 class="text-h5 text-grey-darken-2 mb-2">No se encontraron productos</h3>
          <p class="text-grey-darken-1">Intenta con otros filtros</p>
        </v-col>
      </v-row>

      <v-row v-if="error">
        <v-col cols="12" class="text-center">
          <v-alert type="error" variant="tonal">{{ error }}</v-alert>
          <v-btn color="primary" @click="fetchProducts" class="mt-4">Reintentar</v-btn>
        </v-col>
      </v-row>

      <!-- Carrito -->
      <v-dialog v-model="showCart" max-width="600px">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            Carrito
            <v-btn icon @click="showCart = false"><v-icon>mdi-close</v-icon></v-btn>
          </v-card-title>

          <v-card-text>
            <v-list v-if="cartStore.items.length">
              <v-list-item v-for="i in cartStore.items" :key="i.product.id">
                <template #prepend>
                  <v-img :src="getImageUrl(i.product.imageUrl)" width="64" height="64" cover class="mr-4" />
                </template>
                <v-list-item-title class="font-weight-bold">{{ i.product.name }}</v-list-item-title>
                <v-list-item-subtitle>${{ i.product.price }} x {{ i.quantity }}</v-list-item-subtitle>
                <template #append>
                  <div class="d-flex align-center">
                    <span class="font-weight-bold mr-4">${{ (i.product.price * i.quantity).toFixed(2) }}</span>
                    <v-btn icon size="small" @click="cartStore.removeFromCart(i.product.id)">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <div v-else class="text-center py-8">
              <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-cart-off</v-icon>
              <p class="text-h6 text-grey-darken-2">El carrito está vacío</p>
            </div>

            <v-divider v-if="cartStore.items.length" class="my-4" />
            <div v-if="cartStore.items.length" class="text-right">
              <p class="text-h6 font-weight-bold">Total: ${{ cartStore.totalPrice.toFixed(2) }}</p>
            </div>
          </v-card-text>

          <v-card-actions v-if="cartStore.items.length">
            <v-spacer />
            <v-btn color="grey" variant="text" @click="cartStore.clearCart()">Vaciar</v-btn>
            <v-btn color="primary" variant="flat" @click="checkout">Comprar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar -->
      <v-snackbar v-model="showSnackbar" :timeout="3000" color="success">
        <v-icon class="mr-2">mdi-check-circle</v-icon> Producto agregado al carrito
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { getImageUrl } from '../utils/imageUtils'
import type { Product } from '../types/product'

const router = useRouter()
const { products, loading, error, fetchProducts } = useProductStore()
const cartStore = useCartStore()

const showCart = ref(false)
const showSnackbar = ref(false)
const search = ref('')
const categoryFilter = ref('')
const sortBy = ref('name')

const categories = ['Hoodies', 'Buzos', 'Medias']
const sortOptions = [
  { title: 'Nombre', value: 'name' },
  { title: 'Precio ↑', value: 'price_asc' },
  { title: 'Precio ↓', value: 'price_desc' },
]

const filteredProducts = computed(() => {
  let f = products.filter(p =>
    [p.name, p.description].some(t => t.toLowerCase().includes(search.value.toLowerCase()))
  )
  if (categoryFilter.value)
    f = f.filter(p => p.name.toLowerCase().includes(categoryFilter.value.toLowerCase()))
  return f.sort((a, b) => sortBy.value === 'name' ? a.name.localeCompare(b.name)
    : sortBy.value === 'price_asc' ? a.price - b.price
    : sortBy.value === 'price_desc' ? b.price - a.price : 0)
})

const addToCart = (p: Product) => { cartStore.addToCart(p); showSnackbar.value = true }
const goToProduct = (id: number) => router.push(`/producto/${id}`)
const checkout = () => { alert(`¡Compra realizada! Total: $${cartStore.totalPrice.toFixed(2)}`); cartStore.clearCart(); showCart.value = false }

onMounted(async () => {
  if (!products.length) await fetchProducts()
  if (cartStore.loadCart) cartStore.loadCart()
})
</script>

<style scoped>
.product-card { transition: all 0.3s ease; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); }
.cursor-pointer { cursor: pointer; }
.gap-2 { gap: 8px; }
</style>
