<template>
  <v-main class="fondo-general">
    <!-- 🧥 Hero Section -->
    <section class="hero-section">
      <v-parallax
        src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        height="800"
      >
        <v-container
          class="fill-height d-flex flex-column justify-center align-center text-center text-white"
        >
          <h1 class="text-h2 text-md-h1 font-weight-bold mb-4 text-shadow title-font">
            HoddieShop
          </h1>
          <p class="text-h5 text-md-h4 mb-8 subtitle-font">
            Los mejores hoodies, buzos y medias
          </p>

          <v-btn
            size="x-large"
            color="secondary"
            variant="flat"
            to="/productos"
            class="px-8 mb-10 btn-hero"
          >
            <v-icon start>mdi-shopping</v-icon>
            Comprar Ahora
          </v-btn>

          <!-- 🎠 Carrusel automático de productos MEJORADO -->
          <v-sheet
            class="pa-6 rounded-xl stylish-carousel"
            width="100%"
            max-width="1200px"
            elevation="12"
          >
            <div class="d-flex justify-center align-center mb-4">
              <ShoppingBag class="icon-lucide" />
              <h2 class="text-h5 font-weight-bold text-primary ml-2 title-font">
                Productos Destacados
              </h2>
            </div>

            <div class="carousel-wrapper">
              <v-btn
                icon
                variant="flat"
                color="primary"
                class="carousel-btn left"
                @click="prevSlide"
              >
                <ChevronLeft />
              </v-btn>

              <div class="carousel-container">
                <div
                  class="carousel-track"
                  :style="{ transform: `translateX(-${scrollX}px)` }"
                >
                  <div
                    v-for="product in productStore.products"
                    :key="product.id"
                    class="carousel-item"
                    @click="goToProduct(product.id)"
                  >
                    <v-card flat elevation="6" class="product-card">
                      <div class="image-container">
                        <v-img
                          :src="getImageUrl(product.imageUrl)"
                          height="200"
                          cover
                          @error="onImageError"
                          class="product-image"
                        ></v-img>
                        <div class="popular-badge" v-if="productStore.products.indexOf(product) < 3">
                          Popular
                        </div>
                      </div>
                      <v-card-title class="text-center product-name">
                        {{ product.name }}
                      </v-card-title>
                      <v-card-subtitle class="text-center price">
                        ${{ product.price }}
                      </v-card-subtitle>
                      <div class="quick-actions">
                        <v-btn
                          icon
                          size="small"
                          color="primary"
                          @click.stop="addToCart(product)"
                          class="action-btn"
                        >
                          <v-icon small color="primary">mdi-cart-plus</v-icon>
                        </v-btn>
                      </div>
                    </v-card>
                  </div>
                </div>
              </div>

              <v-btn
                icon
                variant="flat"
                color="primary"
                class="carousel-btn right"
                @click="nextSlide"
              >
                <ChevronRight />
              </v-btn>
            </div>

            <!-- Indicadores del carrusel -->
            <div class="carousel-indicators">
              <div
                v-for="n in Math.ceil(productStore.products.length / 4)"
                :key="n"
                class="indicator-dot"
                :class="{ active: getCurrentIndicator(n) }"
                @click="goToSlide(n)"
              ></div>
            </div>
          </v-sheet>
        </v-container>
      </v-parallax>
    </section>

    <!-- 🆕 Sección de Productos Nuevos -->
    <section class="nuevos-productos py-12">
      <v-container>
        <div class="d-flex justify-center align-center mb-8">
          <Sparkles class="icon-lucide" />
          <h2 class="text-h4 font-weight-bold text-center ml-2 title-font">
            Lo más nuevo
          </h2>
        </div>

        <v-row justify="center" align="stretch">
          <v-col
            v-for="product in nuevosProductos"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="pa-4 text-center nuevos-card"
              elevation="10"
            >
              <div class="image-wrapper">
                <v-img
                  :src="getImageUrl(product.imageUrl)"
                  height="200px"
                  cover
                  class="rounded-lg"
                  @error="onImageError"
                  @click="goToProduct(product.id)"
                ></v-img>
                <div class="new-badge">Nuevo</div>
                <div class="card-actions">
                  <v-btn
                    icon
                    size="small"
                    color="primary"
                    @click.stop="addToCart(product)"
                    class="card-action-btn"
                  >
                    <v-icon small color="primary">mdi-cart-plus</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    color="red"
                    @click.stop="addToFavorites(product)"
                    class="card-action-btn"
                  >
                    <v-icon small color="red">mdi-heart</v-icon>
                  </v-btn>
                </div>
              </div>
              <h3 class="mt-3 text-h6 font-weight-bold product-name" @click="goToProduct(product.id)">
                {{ product.name }}
              </h3>
              <div class="rating mb-2">
                <v-icon
                  v-for="n in 5"
                  :key="n"
                  size="16"
                  :color="n <= 4 ? 'yellow-darken-2' : 'grey-lighten-2'"
                >
                  mdi-star
                </v-icon>
                <span class="text-caption text-grey-darken-2 ml-1">(24)</span>
              </div>
              <p class="text-h6 mb-3 price">
                ${{ product.price }}
              </p>

              <!-- BOTÓN DE CARRITO DE COMPRA MEJORADO -->
              <div class="product-actions">
                <v-btn
                  color="primary"
                  variant="flat"
                  class="btn-carrito"
                  @click="addToCart(product)"
                  block
                >
                  <v-icon start color="white">mdi-cart-plus</v-icon>
                  Agregar al Carrito
                </v-btn>

                <v-btn
                  color="secondary"
                  variant="outlined"
                  class="btn-detalle mt-2"
                  @click="goToProduct(product.id)"
                  block
                >
                  <v-icon start color="primary">mdi-eye</v-icon>
                  Ver Detalle
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Botón ver más productos -->
        <div class="text-center mt-8">
          <v-btn
            to="/productos"
            color="primary"
            variant="outlined"
            size="large"
            class="btn-ver-mas"
          >
            Ver todos los productos
            <v-icon end color="primary">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- 🧾 Footer Moderno COMPLETO -->
    <footer class="footer-moderno">
      <v-container class="footer-container">
        <!-- Sección de Newsletter ULTRA COMPACTA -->
        <div class="newsletter-section-ultra-compact text-center mb-4">
          <div class="newsletter-content-ultra-compact">
            <div class="newsletter-header">
              <v-icon color="primary" size="24" class="newsletter-icon-ultra-compact">mdi-email-newsletter</v-icon>
              <h3 class="newsletter-title-ultra-compact">¡No te pierdas nuestras novedades!</h3>
            </div>
            <p class="newsletter-subtitle-ultra-compact">Suscríbete para recibir ofertas exclusivas</p>
            <div class="newsletter-form-ultra-compact">
              <v-text-field
                placeholder="Tu correo electrónico"
                variant="outlined"
                density="compact"
                class="newsletter-input-ultra-compact"
                hide-details
                single-line
              ></v-text-field>
              <v-btn color="primary" size="small" class="newsletter-btn-ultra-compact">
                <v-icon start size="16" color="white">mdi-send</v-icon>
                Suscribirse
              </v-btn>
            </div>
          </div>
        </div>

        <v-divider class="footer-divider"></v-divider>

        <!-- Información principal en 3 columnas -->
        <v-row class="main-info">
          <!-- Contacto y Empresa -->
          <v-col cols="12" md="4" class="info-column">
            <div class="info-group">
              <h4 class="info-group-title">
                <v-icon color="primary" size="20" class="mr-2">mdi-store</v-icon>
                HoddieShop
              </h4>
              <div class="contact-info">
                <div class="contact-item">
                  <v-icon size="16" color="grey-darken-1">mdi-email</v-icon>
                  <span>contacto@hoodieshop.com</span>
                </div>
                <div class="contact-item">
                  <v-icon size="16" color="grey-darken-1">mdi-map-marker</v-icon>
                  <span>Calle 11 No. 31 A – 42, Bogotá</span>
                </div>
                <div class="contact-item">
                  <v-icon size="16" color="grey-darken-1">mdi-identifier</v-icon>
                  <span>NIT: 900.123.456-7</span>
                </div>
              </div>
            </div>
          </v-col>

          <!-- Métodos de pago MEJORADO -->
          <v-col cols="12" md="4" class="info-column">
            <div class="info-group">
              <h4 class="info-group-title">
                <v-icon color="primary" size="20" class="mr-2">mdi-credit-card</v-icon>
                Medios de Pago
              </h4>

              <!-- Versión compacta y visual mejorada -->
              <div class="payment-methods-compact">
                <div class="payment-icons-grid">
                  <div
                    v-for="method in paymentMethods"
                    :key="method.name"
                    class="payment-icon-wrapper"
                    :title="method.name"
                  >
                    <div class="payment-icon">
                      <v-icon :color="method.color" size="20">{{ method.icon }}</v-icon>
                    </div>
                    <span class="payment-label">{{ method.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <!-- Enlaces legales -->
          <v-col cols="12" md="4" class="info-column">
            <div class="info-group">
              <h4 class="info-group-title">
                <v-icon color="primary" size="20" class="mr-2">mdi-shield-account</v-icon>
                Información Legal
              </h4>
              <div class="legal-links-vertical">
                <a v-for="link in legalLinks" :key="link.text" :href="link.url" class="legal-link">
                  <v-icon size="16" class="mr-2">mdi-chevron-right</v-icon>
                  {{ link.text }}
                </a>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-divider class="footer-divider"></v-divider>

        <!-- Footer inferior -->
        <div class="footer-bottom">
          <div class="brand-section">
            <div class="brand-logo">
              <div class="logo-circle-small">
                <v-icon color="white" size="20">mdi-tshirt-crew</v-icon>
              </div>
              <span class="brand-text">HoddieShop</span>
            </div>
            <div class="copyright">
              © 2025 <strong>HoddieShop</strong> — Todos los derechos reservados.
            </div>
          </div>

          <div class="social-section">
            <div class="social-links-mini">
              <v-btn
                v-for="social in socialMedia"
                :key="social.name"
                icon
                :color="social.color"
                size="small"
                class="social-btn-mini"
                :href="social.url"
                target="_blank"
              >
                <v-icon size="18">{{ social.icon }}</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-container>
    </footer>
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useCartStore } from '@/stores/cart'
import { ShoppingBag, ChevronLeft, ChevronRight, Sparkles } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const productStore = useProductStore()
const cartStore = useCartStore()
const router = useRouter()
const placeholderImage = 'https://via.placeholder.com/300x200?text=Sin+imagen'
const scrollX = ref(0)
let intervalId: number | null = null

// Métodos de pago
const paymentMethods = [
  { name: 'Visa', icon: 'mdi-credit-card', color: '#1a1f71' },
  { name: 'Mastercard', icon: 'mdi-credit-card', color: '#eb001b' },
  { name: 'Nequi', icon: 'mdi-cellphone', color: '#00d4d8' },
  { name: 'Bancolombia', icon: 'mdi-bank', color: '#ff0000' },
  { name: 'Daviplata', icon: 'mdi-wallet', color: '#ff6b00' }
]

// Redes sociales
const socialMedia = [
  { name: 'Instagram', icon: 'mdi-instagram', color: '#e4405f', url: '#' },
  { name: 'Facebook', icon: 'mdi-facebook', color: '#1877f2', url: '#' },
  { name: 'TikTok', icon: 'mdi-tiktok', color: '#000000', url: '#' }
]

// Enlaces legales
const legalLinks = [
  { text: 'Términos y Condiciones', url: '#' },
  { text: 'Política de Privacidad', url: '#' },
  { text: 'Política de Devoluciones', url: '#' }
]

onMounted(async () => {
  await productStore.fetchProducts()
  startAutoScroll()
})
onBeforeUnmount(() => stopAutoScroll())

function startAutoScroll() {
  stopAutoScroll()
  const speed = 1
  intervalId = window.setInterval(() => {
    const trackWidth = document.querySelector('.carousel-track')?.scrollWidth || 0
    const containerWidth = document.querySelector('.carousel-container')?.clientWidth || 0
    scrollX.value += speed
    if (scrollX.value >= trackWidth - containerWidth) scrollX.value = 0
  }, 20)
}

function stopAutoScroll() {
  if (intervalId) {
    window.clearInterval(intervalId)
    intervalId = null
  }
}

function prevSlide() {
  stopAutoScroll()
  scrollX.value = Math.max(scrollX.value - 260, 0)
}

function nextSlide() {
  stopAutoScroll()
  const trackWidth = document.querySelector('.carousel-track')?.scrollWidth || 0
  const containerWidth = document.querySelector('.carousel-container')?.clientWidth || 0
  scrollX.value = Math.min(scrollX.value + 260, trackWidth - containerWidth)
}

function goToSlide(slideIndex: number) {
  stopAutoScroll()
  scrollX.value = (slideIndex - 1) * 260 * 4
}

function getCurrentIndicator(slideIndex: number): boolean {
  const currentSlide = Math.floor(scrollX.value / (260 * 4)) + 1
  return currentSlide === slideIndex
}

function addToCart(product: any) {
  cartStore.addToCart(product)
  Swal.fire({
    icon: 'success',
    title: '¡Agregado al carrito!',
    text: `${product.name} se agregó a tu carrito`,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  })
}

function addToFavorites(product: any) {
  Swal.fire({
    icon: 'info',
    title: 'Agregado a favoritos',
    text: `${product.name} se agregó a tus favoritos`,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  })
}

const getImageUrl = (url: string | null | undefined) =>
  url ? `http://localhost:3333${url.startsWith('/') ? url : '/' + url}` : placeholderImage

const onImageError = (e: Event) => ((e.target as HTMLImageElement).src = placeholderImage)

const goToProduct = (id: number) => router.push(`/producto/${id}`)

const nuevosProductos = computed(() => [...productStore.products].reverse().slice(0, 4))
</script>

<style scoped>
.fondo-general {
  background: linear-gradient(180deg, #ede9fe 0%, #f9fafb 100%);
}

/* Hero */
.text-shadow {
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);
}
.title-font {
  font-family: 'Poppins', sans-serif;
}
.subtitle-font {
  font-family: 'Inter', sans-serif;
  color: #f1f1f1;
}
.btn-hero {
  background: linear-gradient(90deg, #6d28d9, #3b82f6);
  color: white;
  font-weight: bold;
}

/* Carrusel MEJORADO */
.stylish-carousel {
  background: linear-gradient(135deg, #ede9fe, #f5f3ff);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 30px rgba(30, 64, 175, 0.15);
  backdrop-filter: blur(8px);
  max-width: 1200px;
  margin: 0 auto;
}
.icon-lucide {
  width: 28px;
  height: 28px;
  stroke-width: 2.5;
  color: #6d28d9;
}
.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-container {
  overflow: hidden;
  width: 90%;
  max-width: 1000px;
}
.carousel-track {
  display: flex;
  transition: transform 0.4s ease;
  gap: 20px;
}
.carousel-item {
  min-width: 240px;
  flex-shrink: 0;
  cursor: pointer;
}
.product-card {
  border-radius: 12px;
  background: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Texto negro carrusel */
.stylish-carousel h2,
.product-name,
.price {
  color: #000 !important;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.carousel-btn:hover {
  background: #e0e7ff;
}
.carousel-btn.left {
  left: 10px;
}
.carousel-btn.right {
  right: 10px;
}

/* Lo más nuevo */
.nuevos-productos {
  background: linear-gradient(180deg, #ede9fe 0%, #f9fafb 100%);
}
.nuevos-card {
  border-radius: 16px;
  background: linear-gradient(145deg, #ffffff, #f3f4f6);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: default;
}
.nuevos-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(109, 40, 217, 0.25);
}

/* BOTONES DE ACCIÓN PARA PRODUCTOS NUEVOS */
.product-actions {
  margin-top: 12px;
}

.btn-carrito {
  background: linear-gradient(90deg, #6d28d9, #3b82f6) !important;
  color: white !important;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 8px;
  height: 44px;
}

.btn-carrito:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-detalle {
  border: 2px solid #3b82f6 !important;
  color: #3b82f6 !important;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 8px;
  height: 40px;
}

.btn-detalle:hover {
  background: #3b82f6 !important;
  color: white !important;
  transform: translateY(-1px);
}

.btn-ver-mas {
  transition: all 0.3s ease;
  border: 2px solid #3b82f6;
  color: #3b82f6;
}
.btn-ver-mas:hover {
  background: #3b82f6;
  color: white;
  transform: translateX(5px);
}

/* MEJORAS PARA EL CARRUSEL */

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.popular-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(90deg, #ef4444, #f59e0b);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 2;
}

.quick-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .quick-actions {
  opacity: 1;
}

.action-btn {
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* ESTILOS ESPECÍFICOS PARA ICONOS VISIBLES */
.action-btn :deep(.v-icon) {
  color: #3b82f6 !important;
}

.card-action-btn :deep(.v-icon) {
  color: inherit !important;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: #6d28d9;
  transform: scale(1.2);
}

.indicator-dot:hover {
  background: #3b82f6;
}

/* MEJORAS PARA PRODUCTOS NUEVOS */

.image-wrapper {
  position: relative;
  cursor: pointer;
}

.new-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(90deg, #10b981, #059669);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 2;
}

.card-actions {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nuevos-card:hover .card-actions {
  opacity: 1;
}

.card-action-btn {
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.product-name {
  cursor: pointer;
  transition: color 0.3s ease;
}

.product-name:hover {
  color: #3b82f6 !important;
}

/* ESTILOS MEJORADOS PARA MÉTODOS DE PAGO */
.payment-methods-compact {
  margin-top: 0.5rem;
}

.payment-icons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 280px;
}

.payment-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: default;
  transition: all 0.3s ease;
  padding: 8px 4px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid transparent;
}

.payment-icon-wrapper:hover {
  transform: translateY(-2px);
  background: white;
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.payment-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.payment-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #4b5563;
  text-align: center;
  line-height: 1.2;
}

/* NEWSLETTER ULTRA COMPACTA */
.newsletter-section-ultra-compact {
  padding: 1rem 0;
}

.newsletter-content-ultra-compact {
  max-width: 450px;
  margin: 0 auto;
}

.newsletter-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 4px;
}

.newsletter-icon-ultra-compact {
  animation: float 3s ease-in-out infinite;
}

.newsletter-title-ultra-compact {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Poppins', sans-serif;
  margin: 0;
  line-height: 1.2;
}

.newsletter-subtitle-ultra-compact {
  color: #6b7280;
  margin-bottom: 12px;
  font-size: 0.75rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.2;
}

.newsletter-form-ultra-compact {
  display: flex;
  gap: 8px;
  align-items: center;
  max-width: 380px;
  margin: 0 auto;
}

.newsletter-input-ultra-compact {
  flex: 1;
  background: white;
  border-radius: 6px;
  min-height: 36px;
}

.newsletter-input-ultra-compact :deep(.v-field__outline) {
  color: #d1d5db !important;
}

.newsletter-input-ultra-compact :deep(.v-field__input) {
  color: #1f2937 !important;
  font-size: 0.8rem;
  padding-top: 0;
  padding-bottom: 0;
}

.newsletter-input-ultra-compact :deep(.v-field) {
  min-height: 36px;
}

.newsletter-btn-ultra-compact {
  transition: all 0.3s ease;
  background: linear-gradient(90deg, #6d28d9, #3b82f6);
  color: white;
  font-weight: 500;
  white-space: nowrap;
  font-size: 0.75rem;
  height: 36px;
  min-width: 100px;
}

.newsletter-btn-ultra-compact:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* FOOTER COMPLETO RESTAURADO */
.footer-moderno {
  background: linear-gradient(180deg, #ede9fe 0%, #f9fafb 100%);
  color: #111827;
  padding: 30px 0 20px;
  position: relative;
  border-top: 3px solid;
  border-image: linear-gradient(90deg, #6d28d9, #3b82f6, #6d28d9) 1;
}

.footer-container {
  position: relative;
  z-index: 2;
}

.main-info {
  margin: 1.5rem 0;
}

.info-column {
  display: flex;
  justify-content: center;
}

.info-group {
  max-width: 280px;
  width: 100%;
}

.info-group-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
}

.legal-links-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legal-link {
  display: flex;
  align-items: center;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  padding: 0.25rem 0;
}

.legal-link:hover {
  color: #3b82f6;
  transform: translateX(5px);
  transition: all 0.3s ease;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
}

.brand-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-circle-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6d28d9, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.brand-text {
  font-weight: 700;
  font-size: 1.125rem;
  color: #6d28d9;
  font-family: 'Poppins', sans-serif;
}

.copyright {
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
}

.social-section {
  display: flex;
  align-items: center;
}

.social-links-mini {
  display: flex;
  gap: 0.5rem;
}

.social-btn-mini {
  transition: all 0.3s ease;
}

.social-btn-mini:hover {
  transform: scale(1.1) translateY(-2px);
}

.footer-divider {
  border-color: #e5e7eb !important;
  margin: 1.5rem 0;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .carousel-item {
    min-width: 200px;
  }

  .quick-actions,
  .card-actions {
    opacity: 1;
  }

  .newsletter-form-ultra-compact {
    flex-direction: column;
    gap: 10px;
  }

  .newsletter-btn-ultra-compact {
    width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  /* Responsive para métodos de pago */
  .payment-icons-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }

  .payment-icon-wrapper {
    padding: 6px 2px;
  }

  .payment-icon {
    width: 32px;
    height: 32px;
  }

  .payment-label {
    font-size: 0.65rem;
  }

  /* Newsletter responsive */
  .newsletter-header {
    flex-direction: column;
    gap: 4px;
  }

  .newsletter-title-ultra-compact {
    font-size: 0.9rem;
  }

  .newsletter-subtitle-ultra-compact {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .payment-icons-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .newsletter-content-ultra-compact {
    max-width: 100%;
    padding: 0 1rem;
  }

  .newsletter-title-ultra-compact {
    font-size: 0.85rem;
  }
}
</style>
