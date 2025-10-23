import api from './axiosConfig'
import type { Product } from '../types/product'

export const productService = {
  // ✅ Obtener todos los productos
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/products')
    return response.data
  },

  // ✅ Obtener producto por ID
  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // ✅ Obtener productos por categoría
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const response = await api.get(`/products/categoria/id/${categoryId}`)
    return response.data
  },

  // ✅ Crear un nuevo producto
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post('/products', data)
    return response.data
  },

  // ✅ Actualizar producto existente
  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  },

  // ✅ Eliminar producto
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`)
  },
}
