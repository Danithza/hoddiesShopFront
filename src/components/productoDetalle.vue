<template>
  <v-dialog v-model="visible" max-width="600px">
    <v-card>
      <v-img :src="producto.image_url" height="300px" cover />
      <v-card-title>{{ producto.name }}</v-card-title>
      <v-card-subtitle>Precio: ${{ producto.price }}</v-card-subtitle>
      <v-card-text>
        <p>{{ producto.description }}</p>
        <p>Stock: {{ producto.stock }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$emit('add-to-cart', producto)">Agregar al carrito</v-btn>
        <v-btn text color="grey" @click="visible = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { Product } from '@/types/product'

const props = defineProps<{
  modelValue: boolean
  producto: Product
}>()

const emit = defineEmits(['update:modelValue', 'add-to-cart'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => emit('update:modelValue', val))
</script>
