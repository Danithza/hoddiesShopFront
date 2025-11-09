// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1E40AF',    // Azul marino
          secondary: '#3B82F6',  // Azul vibrante
          background: '#FFFFFF',  // Blanco principal
          surface: '#F3F4F6',     // Gris acento
          error: '#EF4444',       // Rojo para errores
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B'
        }
      }
    }
  }
})

const pinia = createPinia()
const app = createApp(App)

// Orden correcto de uso
app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
