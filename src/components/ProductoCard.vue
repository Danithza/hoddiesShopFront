<template>
  <v-card
    class="product-card hover:shadow-xl transition-all duration-300 cursor-pointer"
    elevation="2"
    @click="abrirDetalle"
  >
    <!-- Imagen del producto con overlay -->
    <div class="image-container">
      <v-img
        :src="getImageUrl(product.imageUrl)"
        :alt="product.name"
        height="250"
        cover
        class="product-image"
      >
        <template v-slot:placeholder>
          <div class="image-placeholder">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </template>
      </v-img>

      <!-- Overlay de acciones rápidas -->
      <div class="product-overlay">
        <v-btn
          icon
          variant="flat"
          color="primary"
          size="large"
          @click.stop="agregarAlCarritoRapido"
          class="action-btn"
        >
          <v-icon>mdi-cart-plus</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Contenido de la tarjeta -->
    <v-card-item class="pa-4">
      <!-- Nombre del producto -->
      <v-card-title class="product-name px-0 text-h6 font-weight-medium">
        {{ product.name }}
      </v-card-title>

      <!-- Descripción (si existe) -->
      <v-card-subtitle
        v-if="product.description"
        class="px-0 text-caption text-grey"
      >
        {{ truncateDescription(product.description) }}
      </v-card-subtitle>

      <!-- Precio -->
      <div class="price-container mt-3">
        <span class="text-h6 font-weight-bold text-primary">
          ${{ product.price }}
        </span>
      </div>

      <!-- Información adicional si está disponible -->
      <div v-if="product.stock !== undefined" class="stock-info mt-2">
        <v-chip
          :color="getStockColor(product.stock)"
          size="small"
          variant="flat"
        >
          <v-icon start size="small">
            {{ getStockIcon(product.stock) }}
          </v-icon>
          {{ getStockText(product.stock) }}
        </v-chip>
      </div>
    </v-card-item>

    <!-- Botón de acción rápida en móvil -->
    <v-card-actions class="pa-4 pt-0 mobile-actions">
      <v-btn
        block
        color="primary"
        variant="flat"
        :disabled="isOutOfStock"
        @click.stop="agregarAlCarritoRapido"
        class="text-none"
      >
        <v-icon start>mdi-cart</v-icon>
        Agregar al Carrito
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- Modal de detalle del producto -->
  <ProductoDetalle
    v-model="detalleVisible"
    :producto="product"
    @add-to-cart="handleAddToCart"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductoDetalle from '../components/productoDetalle.vue'
import type { Product } from '@/types/product'

// Props y eventos
const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()

// Estados reactivos
const detalleVisible = ref(false)

// Computed
const isOutOfStock = computed(() => {
  return props.product.stock !== undefined && props.product.stock <= 0
})

// Métodos
const abrirDetalle = () => {
  detalleVisible.value = true
}

const handleAddToCart = (product: Product) => {
  emit('add-to-cart', product)
}

const agregarAlCarritoRapido = (event: Event) => {
  event.stopPropagation()
  emit('add-to-cart', props.product)
}

const truncateDescription = (description: string) => {
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}

const getStockColor = (stock: number) => {
  if (stock > 10) return 'success'
  if (stock > 0) return 'warning'
  return 'error'
}

const getStockIcon = (stock: number) => {
  if (stock > 0) return 'mdi-checkbox-marked-circle'
  return 'mdi-close-circle'
}

const getStockText = (stock: number) => {
  if (stock > 0) return `${stock} disponibles`
  return 'Agotado'
}

// ✅ Función para armar correctamente la URL de la imagen
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'
const getImageUrl = (path: string) => {
  if (!path) return `${API_URL}/images/placeholder.jpg`
  if (path.startsWith('http')) return path
  return `${API_URL}${path}`
}
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.image-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  padding-bottom: 16px;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.action-btn {
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.product-card:hover .action-btn {
  transform: translateY(0);
}

.product-name {
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3em;
}

.price-container {
  display: flex;
  align-items: center;
}

.stock-info {
  display: flex;
  align-items: center;
}

.mobile-actions {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .product-overlay {
    display: none;
  }

  .mobile-actions {
    display: block;
  }

  .product-card:hover {
    transform: none;
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-image,
  .product-overlay,
  .action-btn {
    transition: none;
  }
}
</style>
