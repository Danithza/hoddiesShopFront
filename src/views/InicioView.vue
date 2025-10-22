<template>
  <v-main>
    <!-- Hero Section -->
    <section class="hero-section">
      <v-parallax
        src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        height="800"
      >
        <v-container
          class="fill-height d-flex flex-column justify-center align-center text-center text-white"
        >
          <h1 class="text-h2 text-md-h1 font-weight-bold mb-4">HoddieShop</h1>
          <p class="text-h5 text-md-h4 mb-8">
            Los mejores hoodies, buzos y medias
          </p>

          <v-btn
            size="x-large"
            color="secondary"
            variant="flat"
            to="/productos"
            class="px-8 mb-10"
          >
            <v-icon start>mdi-shopping</v-icon>
            Comprar Ahora
          </v-btn>

          <!-- 🎠 Carrusel automático de productos -->
          <v-sheet
            class="pa-6 rounded-xl bg-white bg-opacity-90"
            width="100%"
            elevation="10"
          >
            <h2 class="text-h5 font-weight-bold text-primary mb-4 text-center">
              Productos Destacados
            </h2>

            <div class="carousel-container">
              <div
                class="carousel-track"
                :style="{ transform: `translateX(-${scrollX}px)` }"
              >
                <div
                  v-for="product in productStore.products"
                  :key="product.id"
                  class="carousel-item"
                  @click="goToProduct(product.id)"
                >
                  <v-card flat elevation="6" class="product-card">
                    <v-img
                      :src="getImageUrl(product.imageUrl)"
                      height="200"
                      cover
                      @error="onImageError"
                    ></v-img>
                    <v-card-title class="text-primary text-center">
                      {{ product.name }}
                    </v-card-title>
                    <v-card-subtitle class="text-center text-grey-darken-1">
                      ${{ product.price }}
                    </v-card-subtitle>
                  </v-card>
                </div>
              </div>
            </div>
          </v-sheet>
        </v-container>
      </v-parallax>
    </section>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import type { Product } from '../types/product'

const productStore = useProductStore()
const router = useRouter()
const placeholderImage = 'https://via.placeholder.com/300x200?text=Sin+imagen'
const scrollX = ref(0)
let intervalId: number | null = null

onMounted(async () => {
  await productStore.fetchProducts()

  // ✅ Animación automática cada 3s
  const speed = 1 // velocidad de movimiento (px por frame)
  intervalId = window.setInterval(() => {
    const trackWidth = document.querySelector('.carousel-track')?.scrollWidth || 0
    const containerWidth = document.querySelector('.carousel-container')?.clientWidth || 0
    scrollX.value += speed

    // Reinicia el scroll cuando llega al final
    if (scrollX.value >= trackWidth - containerWidth) {
      scrollX.value = 0
    }
  }, 20) // cada 20ms para fluidez (~50fps)
})

onBeforeUnmount(() => {
  if (intervalId) window.clearInterval(intervalId)
})

const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return placeholderImage
  return `http://localhost:3333${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
}

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) target.src = placeholderImage
}

const goToProduct = (productId: number) => {
  router.push(`/producto/${productId}`)
}
</script>

<style scoped>
.hero-section {
  position: relative;
}
.bg-opacity-90 {
  background-color: rgba(255, 255, 255, 0.9);
}

.carousel-container {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.carousel-track {
  display: flex;
  transition: transform 0.3s ease;
  will-change: transform;
}

.carousel-item {
  min-width: 240px;
  margin-right: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
</style>
