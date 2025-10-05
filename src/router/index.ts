import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import InicioView from '../views/InicioView.vue'
import ProductosView from '@/views/ProductosView.vue'
import DetalleProductoView from '../views/DetalleProductoVie.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', name: 'home', component: InicioView },
        { path: 'productos', name: 'productos', component: ProductosView },
        { path: 'producto/:id', name: 'detalle', component: DetalleProductoView },
      ],
    },
  ],
})

export default router
