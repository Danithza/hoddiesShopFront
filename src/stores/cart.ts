// stores/cart.ts
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
      state.items.reduce((acc, item) => {
        const price = Number(item.product.price) || 0
        return acc + price * item.quantity
      }, 0),
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

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((i) => i.product.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
        }
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
      try {
        const data = localStorage.getItem('cart')
        if (data) {
          const parsed = JSON.parse(data)
          // Asegurarnos de que los precios sean números
          this.items = parsed.map((item: any) => ({
            ...item,
            product: {
              ...item.product,
              price: Number(item.product.price) || 0
            }
          }))
        }
      } catch (error) {
        console.error('Error loading cart:', error)
        this.items = []
      }
    },
  },
})
