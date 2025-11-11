<template>
  <div class="page-wrapper">
    <v-container class="py-10 categoria-container">
      <h1 class="text-h3 font-weight-bold text-center mb-4 categoria-titulo">
        Medias Deportivas
      </h1>

      <!-- Frase animada -->
      <div class="frase-animada-container">
        <transition name="fade" mode="out-in">
          <p :key="fraseActual" class="frase-animada">
            {{ fraseActual }}
          </p>
        </transition>
      </div>

      <!-- Loader -->
      <v-row v-if="loading" class="loading-row">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="loading-spinner"
          />
        </v-col>
      </v-row>

      <!-- Productos -->
      <v-row v-else-if="productos.length > 0" class="productos-row">
        <v-col
          v-for="producto in productos"
          :key="producto.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="producto-col"
        >
          <v-card
            class="producto-card pa-4 text-center"
            elevation="12"
            @mouseenter="startCardHover(producto.id)"
            @mouseleave="resetCardHover(producto.id)"
            :class="{ 'card-hovered': hovered === producto.id }"
          >
            <div class="image-container" @click="verDetalle(producto.id)">
              <v-img
                :src="getImageUrl(producto.imageUrl)"
                height="180"
                cover
                class="rounded-lg product-img"
                :class="{ 'img-hovered': hovered === producto.id }"
              />
            </div>

            <h3 class="mt-3 nombre-producto">
              {{ producto.name }}
            </h3>
            <p class="precio-producto">
              ${{ producto.price }}
            </p>

            <div class="acciones mt-3">
              <v-btn
                variant="outlined"
                class="btn-ver"
                @click="verDetalle(producto.id)"
                :class="{ 'btn-hovered': hovered === producto.id }"
              >
                <v-icon start>mdi-eye</v-icon> Ver detalle
              </v-btn>

              <v-btn
                class="btn-agregar"
                @click="addToCart(producto)"
                :class="{ 'btn-hovered': hovered === producto.id }"
              >
                <v-icon start>mdi-cart-plus</v-icon> Agregar
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sin productos -->
      <v-row v-else-if="!loading && productos.length === 0" align="center" justify="center">
        <v-col cols="12" class="text-center py-16">
          <v-icon size="80" color="grey-lighten-1">mdi-sock</v-icon>
          <p class="text-grey-darken-1 text-h6 mt-4">
            No hay medias deportivas disponibles actualmente.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { productService } from '@/api/productoServices'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import type { Product } from '@/types/product'

const cartStore = useCartStore()
const router = useRouter()
const productos = ref<Product[]>([])
const loading = ref(true)
const hovered = ref<number | null>(null)

// Frases animadas para medias deportivas
const frases = ref([
  "Máximo confort para tu rendimiento",
  "Tecnología y diseño en cada paso",
  "Ideales para tu actividad deportiva",
  "Calidad que sientes al instante"
])
const fraseActual = ref(frases.value[0])
const fraseIndex = ref(0)
let fraseInterval: number | null = null

// Obtener productos
const obtenerMedias = async () => {
  try {
    productos.value = await productService.getProductsByCategory(3) // ID 3 = Medias
  } catch (error) {
    console.error('Error al obtener medias deportivas:', error)
  } finally {
    loading.value = false
  }
}

// Iniciar animación de frases
const iniciarAnimacionFrases = () => {
  fraseInterval = window.setInterval(() => {
    fraseIndex.value = (fraseIndex.value + 1) % frases.value.length
    fraseActual.value = frases.value[fraseIndex.value]
  }, 3000) // Cambiar cada 3 segundos
}

// Agregar al carrito
const addToCart = (product: Product) => {
  cartStore.addToCart(product)
  console.log('🛒 Agregado al carrito:', product.name)
}

// Ir al detalle
const verDetalle = (id: number) => {
  router.push(`/producto/${id}`)
}

// Construir URL de imagen
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://via.placeholder.com/300x200?text=Sin+imagen'
  return `http://localhost:3333${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
}

// Hover tarjetas
const startCardHover = (id: number) => {
  hovered.value = id
}

const resetCardHover = (id: number) => {
  if (hovered.value === id) {
    hovered.value = null
  }
}

// Ciclo de vida
onMounted(() => {
  obtenerMedias()
  iniciarAnimacionFrases()
})

onUnmounted(() => {
  if (fraseInterval) clearInterval(fraseInterval)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');

/* CONTENEDOR PRINCIPAL */
.page-wrapper {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #e6f0ff 0%, #c2d9ff 100%);
}

.categoria-container {
  background: transparent;
  min-height: 100vh;
}

.categoria-titulo {
  color: #1e3a8a;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* LOADER */
.loading-row {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* FRASES ANIMADAS */
.frase-animada-container {
  height: 40px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.frase-animada {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  color: #374151;
  text-align: center;
  font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.8s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* PRODUCTOS */
.productos-row {
  justify-content: center;
}

.producto-card {
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff, #f8faff);
  border: 2px solid #000000 !important;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.15);
}

.producto-card:hover {
  transform: rotateY(10deg) rotateX(5deg) scale(1.05);
  box-shadow: 0 15px 35px rgba(30, 58, 138, 0.25);
}

/* IMAGEN */
.image-container {
  perspective: 1000px;
  border-radius: 16px;
  overflow: hidden;
}

.product-img {
  transition: transform 0.6s ease, filter 0.3s ease;
}

.img-hovered {
  transform: scale(1.08);
  filter: brightness(1.05);
}

/* TEXTO */
.nombre-producto {
  color: #1e3a8a;
  font-family: 'Poppins', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
}

.precio-producto {
  font-family: 'Inter', sans-serif;
  color: #4b5563;
  font-size: 1.1rem;
  font-weight: 600;
}

/* BOTONES */
.acciones {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-ver {
  color: #000 !important;
  border: 2px solid #000 !important;
  background: transparent !important;
}

.btn-ver:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px) scale(1.05);
}

.btn-agregar {
  background: linear-gradient(90deg, #6d28d9, #3b82f6) !important;
  color: white !important;
  font-weight: 700 !important;
  border-radius: 30px !important;
  border: 2px solid transparent !important;
  transition: all 0.3s ease !important;
}

.btn-agregar:hover {
  transform: scale(1.1) rotate(2deg) !important;
  box-shadow: 0 6px 15px rgba(109, 40, 217, 0.3) !important;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .acciones {
    flex-direction: column;
  }
}
</style>
