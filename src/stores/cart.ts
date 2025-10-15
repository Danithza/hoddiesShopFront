import { defineStore } from 'pinia'
import type { Product, CartItem } from '@/types/product'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalItems: (state) =>
      state.items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
  },
  actions: {
    addToCart(product: Product) {
      const existing = this.items.find((i) => i.product.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ product, quantity: 1 })
      }
      this.saveCart()
    },
    removeFromCart(productId: number) {
      this.items = this.items.filter((i) => i.product.id !== productId)
      this.saveCart()
    },
    clearCart() {
      this.items = []
      this.saveCart()
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    loadCart() {
      const data = localStorage.getItem('cart')
      if (data) {
        this.items = JSON.parse(data)
      }
    },
  },
})
