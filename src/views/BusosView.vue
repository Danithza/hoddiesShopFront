<template>
  <div class="page-wrapper">
    <v-container class="py-10 categoria-container">
      <h1 class="text-h3 font-weight-bold text-center mb-4 categoria-titulo">
        Busos
      </h1>

      <!-- Frase animada -->
      <div class="frase-animada-container">
        <transition name="fade" mode="out-in">
          <p :key="fraseActual" class="frase-animada">
            {{ fraseActual }}
          </p>
        </transition>
      </div>

      <!-- Spinner de carga -->
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

      <!-- Mostrar productos -->
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

      <!-- Mensaje si no hay productos -->
      <v-row v-else align="center" justify="center">
        <v-col cols="12" class="text-center py-16">
          <v-icon size="80" color="grey-lighten-1">mdi-hoodie</v-icon>
          <p class="text-grey-darken-1 text-h6 mt-4">
            No hay busos disponibles actualmente.
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

// Frases animadas para busos
const frases = ref([
  "Confort y estilo para tu día a día",
  "Abraza la calidez y el diseño",
  "Perfectos para cualquier momento",
  "Calidad premium en cada tejido"
])
const fraseActual = ref(frases.value[0])
const fraseIndex = ref(0)
let fraseInterval: number | null = null

const obtenerBusos = async () => {
  try {
    productos.value = await productService.getProductsByCategory(2) // ID 2 = Busos
  } catch (err) {
    console.error('Error al obtener los busos:', err)
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

const addToCart = (product: Product) => {
  cartStore.addToCart(product)
  console.log('🛍 Producto agregado al carrito:', product)
}

const verDetalle = (id: number) => {
  router.push(`/producto/${id}`)
}

const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://via.placeholder.com/300x200?text=Sin+imagen'
  return `http://localhost:3333${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
}

const startCardHover = (id: number) => {
  hovered.value = id
}

const resetCardHover = (id: number) => {
  if (hovered.value === id) {
    hovered.value = null
  }
}

onMounted(() => {
  obtenerBusos()
  iniciarAnimacionFrases()
})

onUnmounted(() => {
  if (fraseInterval) {
    clearInterval(fraseInterval)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');

/* Contenedor principal al 100% */
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
  margin-bottom: 8px !important;
}

/* Loading */
.loading-row {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Contenedor de frase animada */
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
  margin: 0;
}

/* Transición para las frases */
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

.productos-row {
  justify-content: center;
}

.producto-col {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

/* TARJETA CON BORDE NEGRO */
.producto-card {
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff, #f8faff);
  border: 2px solid #000000 !important; /* Borde negro delgado */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.15);
}

.producto-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  z-index: 1;
}

.producto-card:hover::before {
  transform: scaleX(1);
}

.producto-card:hover {
  transform: rotateY(10deg) rotateX(5deg) scale(1.05);
  box-shadow: 0 15px 35px rgba(30, 58, 138, 0.25);
  border-color: #000000 !important; /* Mantener borde negro en hover */
}

.card-hovered {
  transform: rotateY(10deg) rotateX(5deg) scale(1.05);
  box-shadow: 0 15px 35px rgba(30, 58, 138, 0.25);
  border-color: #000000 !important;
}

.image-container {
  perspective: 1000px;
  border-radius: 16px;
  overflow: hidden;
}

.product-img {
  transition: transform 0.6s ease, filter 0.3s ease;
  border-radius: 16px;
}

.img-hovered {
  transform: scale(1.08);
  filter: brightness(1.05);
}

.nombre-producto {
  color: #1e3a8a;
  font-family: 'Poppins', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.3;
}

.precio-producto {
  font-family: 'Inter', sans-serif;
  color: #4b5563;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

/* Botones */
.acciones {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-ver, .btn-agregar {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  border-radius: 30px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  letter-spacing: 0.5px;
  padding: 8px 16px;
  font-size: 0.9rem;
  min-width: 120px;
}

/* Botón Ver Detalle en negro */
.btn-ver {
  color: #000000 !important;
  border: 2px solid #000000 !important;
  background: transparent !important;
}

.btn-ver:hover, .btn-hovered.btn-ver {
  background-color: rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* BOTÓN AGREGAR ORIGINAL - Gradiente morado/azul */
.btn-agregar {
  background: linear-gradient(90deg, #6d28d9, #3b82f6) !important;
  color: white !important;
  font-weight: 700 !important;
  border-radius: 30px !important;
  border: 2px solid transparent !important;
  transition: all 0.3s ease !important;
}

.btn-agregar:hover, .btn-hovered.btn-agregar {
  transform: scale(1.1) rotate(2deg) !important;
  box-shadow: 0 6px 15px rgba(109, 40, 217, 0.3) !important;
  background: linear-gradient(90deg, #5b21b6, #2563eb) !important;
}

/* Efectos de partículas al hacer hover en botón agregar */
.btn-agregar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  opacity: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 80%);
  transition: opacity 0.3s ease;
}

.btn-agregar:hover::after {
  opacity: 1;
}

/* Animación de entrada para las tarjetas */
.producto-card {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efecto de brillo en hover */
.producto-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: inherit;
}

.producto-card:hover::after {
  opacity: 1;
}

/* Responsive */
@media (max-width: 960px) {
  .producto-col {
    margin-bottom: 20px;
  }

  .producto-card {
    max-width: 280px;
  }

  .frase-animada {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .producto-col {
    margin-bottom: 16px;
  }

  .producto-card {
    max-width: 100%;
  }

  .acciones {
    flex-direction: column;
    align-items: center;
  }

  .btn-ver, .btn-agregar {
    width: 100%;
    max-width: 200px;
  }

  .frase-animada {
    font-size: 1rem;
  }

  .frase-animada-container {
    height: 60px;
    margin-bottom: 24px;
  }
}
</style>
