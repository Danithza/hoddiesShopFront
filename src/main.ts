import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1E40AF', // Azul marino (30%)
          secondary: '#3B82F6', // Azul vibrante (10%)
          background: '#FFFFFF', // Blanco puro (60%)
          surface: '#FFFFFF',
        }
      }
    }
  }
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia) // ✅ Pinia debe ir antes del router
app.use(router)
app.use(vuetify)

app.mount('#app')
