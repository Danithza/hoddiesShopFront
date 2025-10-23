<template>
  <v-main>
    <v-container class="py-8" v-if="product">
      <v-row>
        <!-- Imagen del producto -->
        <v-col cols="12" md="6">
          <v-img
            :src="getImageUrl(product.imageUrl)"
            :alt="product.name"
            height="500"
            cover
            class="rounded-lg"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>

        <!-- Información del producto -->
        <v-col cols="12" md="6">
          <v-breadcrumbs :items="breadcrumbs" class="px-0"></v-breadcrumbs>

          <h1 class="text-h3 font-weight-bold text-primary mb-4">
            {{ product.name }}
          </h1>

          <p class="text-h4 font-weight-bold text-secondary mb-4">
            ${{ product.price }}
          </p>

          <p class="text-body-1 text-grey-darken-2 mb-6">
            {{ product.description }}
          </p>

          <!-- Stock -->
          <div class="mb-6">
            <v-chip
              v-if="product.stock > 0"
              color="success"
              variant="tonal"
              size="large"
            >
              <v-icon start>mdi-check</v-icon>
              En stock ({{ product.stock }} disponibles)
            </v-chip>
            <v-chip v-else color="error" variant="tonal" size="large">
              <v-icon start>mdi-close</v-icon>
              Agotado
            </v-chip>
          </div>

          <!-- Acciones -->
          <div class="d-flex gap-4 flex-wrap">
            <v-btn
              size="x-large"
              color="secondary"
              variant="flat"
              :disabled="product.stock === 0"
              @click="addToCart"
              class="flex-grow-1"
            >
              <v-icon start>mdi-cart-plus</v-icon>
              Agregar al Carrito
            </v-btn>

            <v-btn
              size="x-large"
              color="primary"
              variant="outlined"
              @click="$router.back()"
            >
              <v-icon start>mdi-arrow-left</v-icon>
              Volver
            </v-btn>
          </div>

          <!-- Características -->
          <v-card class="mt-8" variant="outlined">
            <v-card-text>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-truck-fast</v-icon>
                  </template>
                  <v-list-item-title>
                    Envío gratis en compras mayores a $50
                  </v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-shield-check</v-icon>
                  </template>
                  <v-list-item-title>Garantía de calidad</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-rotate-3d</v-icon>
                  </template>
                  <v-list-item-title>Devoluciones en 30 días</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Loading -->
    <v-container v-else-if="loading" class="py-16">
      <v-row>
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
          <p class="text-h6 text-grey-darken-2 mt-4">Cargando producto...</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Error -->
    <v-container v-else-if="error" class="py-16">
      <v-row>
        <v-col cols="12" class="text-center">
          <v-alert type="error" variant="tonal" class="mb-4">
            {{ error }}
          </v-alert>
          <v-btn color="primary" @click="$router.back()">
            <v-icon start>mdi-arrow-left</v-icon>
            Volver a productos
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '../api/productoServices'
import type { Product } from '../types/product'

const route = useRoute()
const router = useRouter()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const BASE_URL = 'http://localhost:3333' // URL de tu backend

// 🖼️ Construye correctamente la ruta de la imagen
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '/placeholder-product.jpg'
  return `${BASE_URL}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
}

const breadcrumbs = computed(() => [
  {
    title: 'Inicio',
    disabled: false,
    to: '/'
  },
  {
    title: 'Productos',
    disabled: false,
    to: '/productos'
  },
  {
    title: product.value?.name || 'Producto',
    disabled: true
  }
])

onMounted(async () => {
  const productId = parseInt(route.params.id as string)

  if (isNaN(productId)) {
    error.value = 'ID de producto inválido'
    loading.value = false
    return
  }

  try {
    product.value = await productService.getProductById(productId)
  } catch (err: any) {
    error.value = err.message || 'Error al cargar el producto'
    console.error('Error loading product:', err)
  } finally {
    loading.value = false
  }
})

const addToCart = (): void => {
  if (product.value) {
    console.log('🛒 Agregar al carrito:', product.value)
    // Aquí irá la lógica real del carrito
  }
}
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
</style>
