<template>
  <v-dialog v-model="visible" max-width="800px" scrollable persistent>
    <v-card class="cart-dialog">
      <!-- Header mejorado -->
      <v-card-title class="d-flex justify-space-between align-center bg-primary pa-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cart" color="white" class="mr-3"></v-icon>
          <span class="text-h5 font-weight-bold text-white">Carrito de Compras</span>
        </div>
        <div class="d-flex align-center">
          <v-badge
            v-if="cartStore.items.length > 0"
            :content="cartStore.totalItems"
            color="red"
            class="mr-3"
          >
            <v-icon icon="mdi-shopping" color="white"></v-icon>
          </v-badge>
          <v-btn icon @click="close" color="white" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="pa-0">
        <!-- Carrito vacío -->
        <div v-if="cartStore.items.length === 0" class="empty-cart text-center py-12">
          <v-icon icon="mdi-cart-outline" size="80" color="grey-lighten-1" class="mb-4"></v-icon>
          <h3 class="text-h6 mb-2">Tu carrito está vacío</h3>
          <p class="text-body-1 text-grey mb-6">Agrega algunos productos para comenzar</p>
        </div>

        <!-- Lista de productos mejorada -->
        <v-list v-else class="pa-0">
          <v-list-item
            v-for="item in cartStore.items"
            :key="item.product.id"
            class="cart-item pa-4"
          >
            <template v-slot:prepend>
              <v-img
                :src="getImageUrl(item.product.imageUrl)"
                :alt="item.product.name"
                width="80"
                height="80"
                class="product-image rounded-lg mr-4"
                :cover="true"
              ></v-img>
            </template>

            <template v-slot:title>
              <div class="d-flex justify-space-between align-start w-100">
                <div class="product-info">
                  <h4 class="text-h6 font-weight-medium mb-1">{{ item.product.name }}</h4>
                  <p class="text-body-2 text-grey mb-2">${{ formatPrice(item.product.price) }} c/u</p>

                  <!-- Controles de cantidad mejorados -->
                  <div class="quantity-controls d-flex align-center">
                    <v-btn
                      icon
                      variant="outlined"
                      size="small"
                      :disabled="item.quantity <= 1"
                      @click="decreaseQuantity(item.product.id)"
                      class="quantity-btn"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-3 text-body-1 font-weight-medium quantity-display">
                      {{ item.quantity }}
                    </span>
                    <v-btn
                      icon
                      variant="outlined"
                      size="small"
                      @click="increaseQuantity(item.product.id)"
                      class="quantity-btn"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </div>

                <!-- Precio y acciones -->
                <div class="d-flex flex-column align-end">
                  <p class="text-h6 font-weight-bold text-primary mb-2">
                    ${{ formatPrice(item.product.price * item.quantity) }}
                  </p>
                  <div class="d-flex gap-1">
                    <v-btn
                      icon
                      variant="text"
                      color="error"
                      size="small"
                      @click="removeItem(item.product.id)"
                      class="action-btn"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <!-- Footer con resumen y acciones -->
      <v-card-actions v-if="cartStore.items.length > 0" class="flex-column pa-4 bg-grey-lighten-4">
        <!-- Resumen de compra -->
        <div class="summary-container w-100 mb-4">
          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-1">Subtotal ({{ cartStore.totalItems }} productos)</span>
            <span class="text-body-1 font-weight-medium">${{ formatPrice(cartStore.totalPrice) }}</span>
          </div>

          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-1">Envío</span>
            <span class="text-body-1 success--text" v-if="cartStore.totalPrice >= 50">Gratis</span>
            <span class="text-body-1" v-else>$5.00</span>
          </div>

          <v-divider class="my-2"></v-divider>

          <div class="d-flex justify-space-between">
            <span class="text-h6 font-weight-bold">Total</span>
            <span class="text-h6 font-weight-bold text-primary">
              ${{ formatPrice(totalFinal) }}
            </span>
          </div>
        </div>

        <!-- Botones de acción mejorados -->
        <div class="d-flex gap-3 w-100">
          <v-btn
            color="error"
            variant="outlined"
            @click="clearCart"
            class="flex-grow-1 text-none"
          >
            <v-icon icon="mdi-delete-sweep" class="mr-2"></v-icon>
            Vaciar Todo
          </v-btn>

          <v-btn
            color="primary"
            @click="checkout"
            class="flex-grow-1 text-none"
            size="large"
          >
            <v-icon icon="mdi-credit-card-outline" class="mr-2"></v-icon>
            Comprar Ahora
          </v-btn>
        </div>

        <v-btn
          variant="text"
          @click="close"
          class="mt-3 text-none"
          block
        >
          <v-icon icon="mdi-arrow-left" class="mr-2"></v-icon>
          Seguir Comprando
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const cartStore = useCartStore()
const visible = ref(props.modelValue)

// Cargar el carrito al montar el componente
onMounted(() => {
  cartStore.loadCart()
})

// Computed para el total final
const totalFinal = computed(() => {
  const subtotal = cartStore.totalPrice
  const envio = subtotal >= 50 ? 0 : 5
  return subtotal + envio
})

// Watchers
watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// Función para formatear precios de forma segura
const formatPrice = (price: any) => {
  const num = Number(price)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// Función para obtener URL de imagen
const getImageUrl = (path: string) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'
  if (!path) return `${API_URL}/images/placeholder.jpg`
  if (path.startsWith('http')) return path
  return `${API_URL}${path}`
}

// Funciones para manejar cantidades
const increaseQuantity = (productId: number) => {
  const item = cartStore.items.find(item => item.product.id === productId)
  if (item) {
    cartStore.updateQuantity(productId, item.quantity + 1)
  }
}

const decreaseQuantity = (productId: number) => {
  const item = cartStore.items.find(item => item.product.id === productId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1)
  }
}

// Eliminar item individual
const removeItem = (productId: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
    cartStore.removeFromCart(productId)
  }
}

// Vaciar carrito completo
const clearCart = () => {
  if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
    cartStore.clearCart()
  }
}

// Cerrar modal
const close = () => {
  visible.value = false
}

// Checkout
const checkout = () => {
  alert(`¡Compra realizada!\nTotal pagado: $${formatPrice(totalFinal.value)}`)
  cartStore.clearCart()
  close()
}
</script>

<style scoped>
.cart-dialog {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.empty-cart {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
}

.cart-item {
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  background: white;
}

.cart-item:hover {
  background-color: #f8f9fa;
}

.cart-item:last-child {
  border-bottom: none;
}

.product-image {
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  width: fit-content;
}

.quantity-btn {
  border-radius: 6px;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.summary-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.gap-3 {
  gap: 12px;
}

.w-100 {
  width: 100%;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>
