<template>
  <v-main class="page-wrapper">
    <v-container class="categoria-container py-4" v-if="product">
      <v-row class="align-start">
        <!-- Imagen del producto -->
        <v-col cols="12" md="5">
          <div class="image-container">
            <v-img
              :src="getImageUrl(product.imageUrl)"
              :alt="product.name"
              height="320"
              cover
              class="product-img rounded-lg"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
                </v-row>
              </template>
            </v-img>

            <!-- Badge de stock -->
            <div class="stock-badge-detalle" :class="getStockClass(product.stock)">
              <v-icon size="14" class="mr-1">
                {{ getStockIcon(product.stock) }}
              </v-icon>
              {{ getStockText(product.stock) }}
            </div>
          </div>
        </v-col>

        <!-- Información del producto -->
        <v-col cols="12" md="7">
          <v-breadcrumbs :items="breadcrumbs" class="px-0 mb-3 breadcrumbs-custom"></v-breadcrumbs>

          <h1 class="nombre-producto-detalle">
            {{ product.name }}
          </h1>

          <div class="precio-section-detalle mb-3">
            <span class="precio-producto-detalle">${{ formatPrice(product.price) }}</span>
            <v-chip
              v-if="product.stock <= 10 && product.stock > 0"
              color="warning"
              size="small"
              class="stock-warning-detalle"
            >
              <v-icon start size="12">mdi-alert</v-icon>
              ¡Últimas unidades!
            </v-chip>
          </div>

          <p class="descripcion-producto mb-4">
            {{ product.description || 'Este producto no tiene descripción disponible.' }}
          </p>

          <!-- Controles de cantidad -->
          <div class="cantidad-controls-detalle mb-4">
            <span class="cantidad-label">Cantidad:</span>
            <div class="cantidad-buttons">
              <v-btn
                icon
                variant="outlined"
                size="small"
                :disabled="quantity <= 1"
                @click="decreaseQuantity"
                class="quantity-btn-detalle"
              >
                <v-icon size="16">mdi-minus</v-icon>
              </v-btn>
              <span class="cantidad-display">{{ quantity }}</span>
              <v-btn
                icon
                variant="outlined"
                size="small"
                :disabled="quantity >= product.stock"
                @click="increaseQuantity"
                class="quantity-btn-detalle"
              >
                <v-icon size="16">mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Acciones -->
          <div class="acciones-detalle mb-3">
            <v-btn
              size="large"
              color="primary"
              variant="flat"
              :disabled="product.stock === 0"
              @click="addToCart"
              class="btn-agregar-detalle flex-grow-1"
            >
              <v-icon start size="18">mdi-cart-plus</v-icon>
              Agregar al Carrito ({{ quantity }})
            </v-btn>

            <v-btn
              size="large"
              color="black"
              variant="outlined"
              @click="$router.back()"
              class="btn-volver-detalle"
            >
              <v-icon start size="18">mdi-arrow-left</v-icon>
              Volver
            </v-btn>
          </div>

          <!-- Mensaje de stock agotado -->
          <div v-if="product.stock === 0" class="out-of-stock-alert mb-3">
            <v-alert type="error" variant="tonal" density="compact" class="mb-0">
              <v-icon start size="16">mdi-alert-circle</v-icon>
              Producto agotado temporalmente
            </v-alert>
          </div>

          <!-- Características -->
          <v-card class="caracteristicas-card" variant="outlined">
            <v-card-text class="caracteristicas-content">
              <v-list class="caracteristicas-list" density="compact">
                <v-list-item class="caracteristica-item">
                  <template v-slot:prepend>
                    <v-icon color="primary" size="18" class="caracteristica-icon">mdi-truck-fast</v-icon>
                  </template>
                  <v-list-item-title class="caracteristica-text">
                    Envío gratis en compras mayores a $50
                  </v-list-item-title>
                </v-list-item>

                <v-list-item class="caracteristica-item">
                  <template v-slot:prepend>
                    <v-icon color="primary" size="18" class="caracteristica-icon">mdi-shield-check</v-icon>
                  </template>
                  <v-list-item-title class="caracteristica-text">
                    Garantía de calidad
                  </v-list-item-title>
                </v-list-item>

                <v-list-item class="caracteristica-item">
                  <template v-slot:prepend>
                    <v-icon color="primary" size="18" class="caracteristica-icon">mdi-rotate-3d</v-icon>
                  </template>
                  <v-list-item-title class="caracteristica-text">
                    Devoluciones en 30 días
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Loading -->
    <v-container v-else-if="loading" class="py-8">
      <v-row>
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate size="40" color="primary"></v-progress-circular>
          <p class="text-body-2 text-grey-darken-2 mt-2">Cargando producto...</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Error -->
    <v-container v-else-if="error" class="py-8">
      <v-row>
        <v-col cols="12" class="text-center">
          <v-alert type="error" variant="tonal" density="comfortable" class="mb-3">
            {{ error }}
          </v-alert>
          <v-btn color="primary" @click="$router.back()" class="btn-error" size="large">
            <v-icon start size="18">mdi-arrow-left</v-icon>
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
import { useCartStore } from '@/stores/cart'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)

const BASE_URL = 'http://localhost:3333'

// 🖼️ Construye correctamente la ruta de la imagen
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '/placeholder-product.jpg'
  return `${BASE_URL}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
}

const onImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = '/placeholder-product.jpg'
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

// Funciones de cantidad
const increaseQuantity = () => {
  if (quantity.value < (product.value?.stock || 0)) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Funciones de stock
const getStockClass = (stock: number) => {
  if (stock > 10) return 'stock-available'
  if (stock > 0) return 'stock-low'
  return 'stock-out'
}

const getStockIcon = (stock: number) => {
  if (stock > 10) return 'mdi-check-circle'
  if (stock > 0) return 'mdi-alert-circle'
  return 'mdi-close-circle'
}

const getStockText = (stock: number) => {
  if (stock > 10) return `${stock} disponibles`
  if (stock > 0) return `Solo ${stock} disponibles`
  return 'Agotado'
}

const formatPrice = (price: any) => {
  const num = Number(price)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

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
    // Agregar al carrito usando el store con la cantidad seleccionada
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addToCart(product.value)
    }

    // Feedback con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al carrito!',
      text: `${quantity.value} x ${product.value.name} se agregó a tu carrito`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap');

/* Contenedor principal */
.page-wrapper {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #e6f0ff 0%, #c2d9ff 100%);
}

.categoria-container {
  background: transparent;
  min-height: 100vh;
}

/* Breadcrumbs personalizados */
.breadcrumbs-custom {
  font-family: 'Inter', sans-serif;
}

.breadcrumbs-custom :deep(.v-breadcrumbs-item) {
  color: #6b7280 !important;
  font-weight: 500;
  font-size: 0.8rem;
}

.breadcrumbs-custom :deep(.v-breadcrumbs-item--disabled) {
  color: #374151 !important;
  font-weight: 600;
}

/* Imagen del producto - MÁS PEQUEÑA */
.image-container {
  position: relative;
  perspective: 1000px;
}

.product-img {
  transition: transform 0.6s ease, filter 0.3s ease;
  border: 2px solid #000000 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.15);
}

.product-img:hover {
  transform: scale(1.02);
  filter: brightness(1.05);
}

.stock-badge-detalle {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: 'Inter', sans-serif;
}

.stock-available {
  background: rgba(34, 197, 94, 0.9);
  color: white;
}

.stock-low {
  background: rgba(245, 158, 11, 0.9);
  color: white;
}

.stock-out {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

/* Información del producto - UNIFORME */
.nombre-producto-detalle {
  color: #1e3a8a;
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.3;
}

.precio-section-detalle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.precio-producto-detalle {
  font-family: 'Inter', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e40af;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stock-warning-detalle {
  font-weight: 600;
  font-size: 0.7rem;
  height: 24px;
}

.descripcion-producto {
  font-family: 'Inter', sans-serif;
  color: #4b5563;
  line-height: 1.5;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

/* Controles de cantidad - UNIFORME */
.cantidad-controls-detalle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  margin-bottom: 16px;
}

.cantidad-label {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.cantidad-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn-detalle {
  border-radius: 6px;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
}

.quantity-btn-detalle:hover {
  transform: scale(1.1);
}

.cantidad-display {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #1e40af;
  min-width: 30px;
  text-align: center;
}

/* Acciones - UNIFORME */
.acciones-detalle {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

/* Botón Agregar al Carrito */
.btn-agregar-detalle {
  background: linear-gradient(90deg, #6d28d9, #3b82f6) !important;
  color: white !important;
  font-weight: 600 !important;
  border-radius: 20px !important;
  border: 2px solid transparent !important;
  transition: all 0.3s ease !important;
  font-family: 'Inter', sans-serif !important;
  padding: 10px 20px !important;
  font-size: 0.85rem !important;
  height: 44px !important;
}

.btn-agregar-detalle:hover:not(.v-btn--disabled) {
  transform: scale(1.05) !important;
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.3) !important;
  background: linear-gradient(90deg, #5b21b6, #2563eb) !important;
}

.btn-agregar-detalle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Botón Volver */
.btn-volver-detalle {
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  border-radius: 20px !important;
  transition: all 0.3s ease !important;
  padding: 10px 20px !important;
  border: 2px solid #000000 !important;
  color: #000000 !important;
  background: transparent !important;
  min-width: 100px;
  font-size: 0.85rem !important;
  height: 44px !important;
}

.btn-volver-detalle:hover {
  background-color: rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Alerta de stock agotado */
.out-of-stock-alert {
  font-family: 'Inter', sans-serif;
}

.out-of-stock-alert :deep(.v-alert) {
  font-size: 0.8rem;
  padding: 8px 12px;
}

/* Características - UNIFORME */
.caracteristicas-card {
  border-radius: 10px !important;
  border: 2px solid #000000 !important;
  background: linear-gradient(145deg, #ffffff, #f8faff) !important;
  box-shadow: 0 2px 8px rgba(30, 58, 138, 0.15) !important;
}

.caracteristicas-content {
  padding: 12px !important;
}

.caracteristicas-list {
  background: transparent !important;
}

.caracteristica-item {
  padding: 6px 0 !important;
  border-bottom: 1px solid #e5e7eb;
  min-height: 40px;
}

.caracteristica-item:last-child {
  border-bottom: none;
}

.caracteristica-icon {
  margin-right: 10px;
}

.caracteristica-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
}

/* Botón de error */
.btn-error {
  border-radius: 20px !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  font-size: 0.85rem !important;
  height: 44px !important;
  padding: 0 20px !important;
}

/* Responsive */
@media (max-width: 960px) {
  .nombre-producto-detalle {
    font-size: 1.3rem;
  }

  .precio-producto-detalle {
    font-size: 1.5rem;
  }

  .cantidad-controls-detalle {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .cantidad-buttons {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .categoria-container {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
  }

  .nombre-producto-detalle {
    font-size: 1.2rem;
  }

  .precio-producto-detalle {
    font-size: 1.3rem;
  }

  .acciones-detalle {
    flex-direction: column;
  }

  .btn-agregar-detalle,
  .btn-volver-detalle {
    width: 100%;
  }

  .precio-section-detalle {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .descripcion-producto {
    font-size: 0.85rem;
  }

  .product-img {
    height: 280px !important;
  }

  .caracteristicas-card {
    margin-top: 8px;
  }
}
</style>
