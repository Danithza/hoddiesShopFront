import api from './axiosConfig'
import type { Product } from '../types/product'

export const productService = {
  // Obtener todos los productos
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/products')
    return response.data
  },

  // Obtener producto por ID
  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // ✅ Obtener productos por categoría (usando el endpoint real)
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const response = await api.get(`/products/categoria/id/${categoryId}`)
    return response.data
  },
}
