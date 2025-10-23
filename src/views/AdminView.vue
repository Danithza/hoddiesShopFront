<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-4">
          <v-card-title class="text-h5">Gestión de Productos</v-card-title>

          <v-btn color="primary" class="my-4" @click="abrirDialogo">
            Agregar Producto
          </v-btn>

          <v-data-table
            :headers="headers"
            :items="productos"
            class="elevation-1"
            :items-per-page="5"
          >
            <template #item.imageUrl="{ item }">
              <v-img :src="item.imageUrl" height="60" width="60" contain />
            </template>

            <template #item.actions="{ item }">
              <v-btn icon="mdi-pencil" color="warning" @click="editarProducto(item)" />
              <v-btn icon="mdi-delete" color="error" @click="confirmarEliminacion(item.id)" />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo Crear/Editar -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ editando ? 'Editar Producto' : 'Nuevo Producto' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValido">
            <v-text-field v-model="form.name" label="Nombre" required />
            <v-textarea v-model="form.description" label="Descripción" required />
            <v-text-field v-model="form.price" label="Precio" type="number" required />
            <v-text-field v-model="form.stock" label="Stock" type="number" required />

            <v-file-input label="Imagen" accept="image/*" prepend-icon="mdi-camera" @change="subirImagen" />

            <v-select
              v-model="form.category_id"
              :items="categorias"
              item-title="nombre"
              item-value="id"
              label="Categoría"
              required
            />

            <v-img v-if="form.imageUrl" :src="form.imageUrl" max-height="150" contain class="mt-4" />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn color="primary" :disabled="!formValido" @click="guardarProducto">
            {{ editando ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmación eliminación -->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title>¿Eliminar producto?</v-card-title>
        <v-card-text>Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn color="error" @click="eliminarProducto">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '../api/productoServices'
import type { Product } from '@/types/product'

const productos = ref<Product[]>([])
const dialog = ref(false)
const dialogEliminar = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref()
const productoIdAEliminar = ref<number | null>(null)

const categorias = ref([
  { id: 1, nombre: 'Sacos' },
  { id: 2, nombre: 'Busos' },
  { id: 3, nombre: 'Medias' },
])

const form = ref<Partial<Product>>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  category_id: null,
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Precio', key: 'price' },
  { title: 'Stock', key: 'stock' },
  { title: 'Imagen', key: 'imageUrl' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

onMounted(cargarProductos)

async function cargarProductos() {
  try {
    productos.value = await productService.getProducts()
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

function abrirDialogo() {
  form.value = { name: '', description: '', price: 0, stock: 0, imageUrl: '', category_id: null }
  editando.value = false
  dialog.value = true
}

function editarProducto(item: Product) {
  form.value = { ...item }
  editando.value = true
  dialog.value = true
}

function cerrarDialogo() {
  dialog.value = false
  form.value = { name: '', description: '', price: 0, stock: 0, imageUrl: '', category_id: null }
}

async function guardarProducto() {
  if (!formValido.value) return

  try {
    if (editando.value && form.value.id) {
      await productService.updateProduct(form.value.id, form.value)
    } else {
      await productService.createProduct(form.value)
    }
    cargarProductos()
  } catch (error) {
    console.error('Error guardando producto:', error)
  } finally {
    cerrarDialogo()
  }
}

function confirmarEliminacion(id: number) {
  productoIdAEliminar.value = id
  dialogEliminar.value = true
}

async function eliminarProducto() {
  if (!productoIdAEliminar.value) return
  try {
    await productService.deleteProduct(productoIdAEliminar.value)
    cargarProductos()
  } catch (error) {
    console.error('Error eliminando producto:', error)
  } finally {
    dialogEliminar.value = false
  }
}

function subirImagen(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  form.value.imageUrl = URL.createObjectURL(file) // simulación
}
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
