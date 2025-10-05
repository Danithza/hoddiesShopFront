<template>
  <v-main>
    <v-container class="py-8">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold text-primary mb-4">Contacto</h1>
          <p class="text-h6 text-grey-darken-2">
            ¿Tienes alguna pregunta? No dudes en contactarnos.
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card variant="outlined">
            <v-card-text class="pa-6">
              <h3 class="text-h5 mb-4">Información de Contacto</h3>
              <v-list>
                <v-list-item>
                  <v-list-item-title class="text-body-1">
                    <v-icon color="primary" class="mr-2">mdi-email</v-icon>
                    info@hoddieshop.com
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-body-1">
                    <v-icon color="primary" class="mr-2">mdi-phone</v-icon>
                    +1 234 567 890
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-body-1">
                    <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                    Dirección: Calle Principal 123, Ciudad
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
// Vista de contacto básica
</script>
