import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productService } from '../api/productoServices'
import type { Product } from '../types/product'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const featuredProducts = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await productService.getProducts()
      products.value = data
      featuredProducts.value = data.slice(0, 4)
    } catch (err: any) {
      error.value = err.message || 'Error al cargar productos'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  const getProductById = (id: number) => {
    return products.value.find(product => product.id === id)
  }

  return {
    products,
    featuredProducts,
    loading,
    error,
    fetchProducts,
    getProductById
  }
})
