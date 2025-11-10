<template>
  <v-footer color="primary" class="footer-simple py-6">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <!-- Logo y Nombre -->
          <div class="brand-content">
            <div class="logo-footer mb-3">
              <Shirt class="icon-logo text-white" />
              <span class="text-h5 font-weight-bold white--text ml-2">HODDIES</span>
            </div>
            <p class="text-caption white--text opacity-75">
              Tu estilo, nuestra pasión
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { Shirt } from 'lucide-vue-next'
</script>

<style scoped>
.footer-simple {
  background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 100%) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Logo Footer */
.logo-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.icon-logo {
  width: 24px;
  height: 24px;
  stroke-width: 2.5;
}

/* Contenido de la marca */
.brand-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 600px) {
  .footer-simple {
    padding: 24px 0 !important;
  }

  .logo-footer {
    flex-direction: column;
    gap: 8px;
  }

  .text-h5 {
    font-size: 1.5rem !important;
  }
}
</style>
