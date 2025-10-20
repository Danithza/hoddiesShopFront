<template>
  <v-footer color="primary" class="py-6">
    <v-container>
      <v-row align="center" justify="space-between">
        <!-- Logo -->
        <v-col cols="12" sm="auto" class="text-center text-sm-left">
          <div class="text-h6 font-weight-bold white--text">
            HoddieShop
          </div>
        </v-col>

        <!-- Redes sociales -->
        <v-col cols="12" sm="auto" class="text-center">
          <v-btn
            v-for="social in socialLinks"
            :key="social.icon"
            :href="social.url"
            icon
            small
            class="mx-2 white--text"
            target="_blank"
          >
            <v-icon small>{{ social.icon }}</v-icon>
          </v-btn>
        </v-col>

        <!-- Contacto -->
        <v-col cols="12" sm="auto" class="text-center text-sm-right">
          <div class="white--text text-caption">
            <v-icon small color="white" class="mr-1">mdi-email</v-icon>
            info@hoddieshop.com
          </div>
        </v-col>
      </v-row>

      <!-- Copyright -->
      <v-divider class="my-4 opacity-50" color="white"></v-divider>
      <div class="text-center white--text text-caption opacity-75">
        &copy; 2024 HoddieShop · Todos los derechos reservados
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
const socialLinks = [
  { icon: 'mdi-instagram', url: '#' },
  { icon: 'mdi-facebook', url: '#' },
  { icon: 'mdi-tiktok', url: '#' }
]
</script>
