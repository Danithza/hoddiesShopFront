<template>
  <v-footer color="primary" class="mt-16">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <div class="text-h6 font-weight-bold white--text mb-4">
            HoddieShop
          </div>
          <p class="white--text text-caption">
            Tu tienda favorita de hoodies, buzos y medias de la mejor calidad.
          </p>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-h6 white--text mb-4">Enlaces rápidos</div>
          <v-list color="transparent" class="pa-0">
            <v-list-item
              v-for="link in quickLinks"
              :key="link.text"
              :to="link.to"
              class="px-0"
            >
              <v-list-item-title class="white--text text-caption">
                {{ link.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-h6 white--text mb-4">Contacto</div>
          <div class="white--text text-caption">
            <v-icon small color="white" class="mr-2">mdi-email</v-icon>
            info@hoddieshop.com
          </div>
          <div class="white--text text-caption mt-2">
            <v-icon small color="white" class="mr-2">mdi-phone</v-icon>
            +1 234 567 890
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" color="white"></v-divider>

      <div class="text-center white--text text-caption">
        &copy; 2024 HoddieShop. Todos los derechos reservados.
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
const quickLinks = [
  { text: 'Inicio', to: '/' },
  { text: 'Productos', to: '/productos' },
  { text: 'Sobre Nosotros', to: '/about' },
  { text: 'Política de Privacidad', to: '/privacy' }
]
</script>
