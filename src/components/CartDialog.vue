<template>
  <v-dialog v-model="visible" max-width="600px">
    <v-card>
      <v-card-title>Carrito de compras</v-card-title>
      <v-card-text>
        <v-list v-if="cartStore.items.length > 0">
          <v-list-item
            v-for="item in cartStore.items"
            :key="item.product.id"
          >
            <!-- Avatar -->
            <v-img
              :src="item.product.imageUrl || '/images/placeholder.jpg'"
              class="mr-4"
              max-width="64"
              max-height="64"
              contain
            />

            <!-- Contenido del producto -->
            <div>
              <div class="font-medium">{{ item.product.name }}</div>
              <div class="text-sm text-gray-500">
                ${{ item.product.price }} x {{ item.quantity }}
              </div>
            </div>

            <v-spacer></v-spacer>

            <!-- Acción eliminar -->
            <v-btn icon @click="cartStore.removeFromCart(item.product.id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>

        <p v-else class="text-center">El carrito está vacío</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="grey" @click="visible = false">Cerrar</v-btn>
        <v-btn
          color="primary"
          @click="checkout"
          :disabled="cartStore.items.length === 0"
        >
          Comprar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const cartStore = useCartStore()
const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => (visible.value = val))
watch(visible, (val) => emit('update:modelValue', val))

const checkout = () => {
  alert(`Total a pagar: $${cartStore.totalPrice}`)
  cartStore.clearCart()
  visible.value = false
}
</script>
