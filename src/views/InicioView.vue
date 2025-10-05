<template>
  <v-main>
    <!-- Hero Section -->
    <section class="hero-section">
      <v-parallax
        src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        height="600"
      >
        <v-container class="fill-height">
          <v-row align="center" justify="center">
            <v-col cols="12" class="text-center">
              <h1 class="text-h2 text-md-h1 font-weight-bold text-white mb-4">
                HoddieShop
              </h1>
              <p class="text-h5 text-md-h4 text-white mb-8">
                Los mejores hoodies, buzos y medias
              </p>
              <v-btn
                size="x-large"
                color="secondary"
                variant="flat"
                to="/productos"
                class="px-8"
              >
                <v-icon start>mdi-shopping</v-icon>
                Comprar Ahora
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </section>

    <!-- Featured Products -->
    <section class="featured-products py-16">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-8">
            <h2 class="text-h3 font-weight-bold text-primary mb-4">
              Productos Destacados
            </h2>
            <p class="text-h6 text-grey-darken-2">
              Descubre nuestra colección más popular
            </p>
          </v-col>
        </v-row>

        <v-row v-if="productStore.loading">
          <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
            <v-skeleton-loader type="image, heading, text, button"></v-skeleton-loader>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col
            v-for="product in productStore.featuredProducts"
            :key="product.id"
            cols="12"
            sm="6"
            md="3"
          >
            <ProductCard
              :product="product"
              @add-to-cart="addToCart"
            />
          </v-col>
        </v-row>

        <v-row v-if="productStore.error">
          <v-col cols="12" class="text-center">
            <v-alert type="error" variant="tonal">
              {{ productStore.error }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-center mt-8">
            <v-btn
              size="large"
              color="primary"
              variant="outlined"
              to="/productos"
            >
              Ver Todos los Productos
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="features-section py-16 bg-grey-lighten-4">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="primary" class="mb-4">mdi-truck-fast</v-icon>
            <h3 class="text-h5 font-weight-bold text-primary mb-2">
              Envío Gratis
            </h3>
            <p class="text-grey-darken-2">
              Envío gratuito en compras superiores a $50
            </p>
          </v-col>

          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="primary" class="mb-4">mdi-shield-check</v-icon>
            <h3 class="text-h5 font-weight-bold text-primary mb-2">
              Calidad Garantizada
            </h3>
            <p class="text-grey-darken-2">
              Productos de la mejor calidad del mercado
            </p>
          </v-col>

          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="primary" class="mb-4">mdi-headset</v-icon>
            <h3 class="text-h5 font-weight-bold text-primary mb-2">
              Soporte 24/7
            </h3>
            <p class="text-grey-darken-2">
              Atención al cliente disponible todo el día
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import ProductCard from '../components/ProductoCard.vue'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})

const addToCart = (product: any) => {
  console.log('Agregar al carrito:', product)
}
</script>
