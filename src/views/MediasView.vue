<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6 text-center">Medias Deportivas</h1>

    <v-row>
      <v-col
        v-for="producto in productos"
        :key="producto.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="hover:shadow-lg transition-all duration-300">
          <v-img :src="producto.imageUrl" height="200" cover></v-img>
          <v-card-title>{{ producto.name }}</v-card-title>
          <v-card-subtitle>${{ producto.price }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const productos = ref<any[]>([])

async function obtenerMedias() {
  const res = await fetch('http://localhost:3333/products/categoria/Medias deportivas')
  productos.value = await res.json()
}

onMounted(obtenerMedias)
</script>
