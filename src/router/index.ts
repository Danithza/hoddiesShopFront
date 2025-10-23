import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// 🏠 Vistas principales
import InicioView from '@/views/InicioView.vue'
import ProductosView from '@/views/ProductosView.vue'
import DetalleProductoVie from '../views/DetalleProductoVie.vue'
import ContactoView from '@/views/ContactoView.vue'
import AdminView from '@/views/AdminView.vue'

// 🧢 Vistas por categoría
import SacosView from '@/views/SacosView.vue'
import BusosView from '@/views/BusosView.vue'
import MediasView from '@/views/MediasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: InicioView },
        { path: 'productos', name: 'productos', component: ProductosView },
        { path: 'producto/:id', name: 'detalle', component: DetalleProductoVie },
        { path: 'contacto', name: 'contacto', component: ContactoView },
         { path: 'Admin', name: 'Admin', component: AdminView },

        // 🧩 Categorías
        { path: 'sacos', name: 'sacos', component: SacosView },
        { path: 'busos', name: 'busos', component: BusosView },
        { path: 'medias', name: 'medias', component: MediasView },

        // 👤 Autenticació
        { path: 'registro', name: 'registro', component: () => import('@/views/RegistroView.vue') },
        { path: 'login', name: 'login', component: () => import('@/views/LoginView.vue') },
      ],
    },
  ],
})

export default router
