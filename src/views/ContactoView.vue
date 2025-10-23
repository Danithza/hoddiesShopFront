<template>
  <v-main>
    <v-container class="py-8">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold text-primary mb-4">Contáctanos</h1>
          <p class="text-h6 text-grey-darken-2">
            ¿Necesitas ayuda? Estamos aquí para responder todas tus preguntas.
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="h-100" elevation="2">
            <v-card-text class="pa-6">
              <h3 class="text-h5 mb-6">Nuestros Contactos</h3>
              <div class="mb-6">
                <div class="d-flex align-center mb-4">
                  <v-icon color="primary" size="large" class="mr-3">mdi-email</v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">Email</div>
                    <div class="text-body-1">info@hoddieshop.com</div>
                    <div class="text-body-1">ventas@hoddieshop.com</div>
                  </div>
                </div>
                <div class="d-flex align-center mb-4">
                  <v-icon color="primary" size="large" class="mr-3">mdi-phone</v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">Teléfono</div>
                    <div class="text-body-1">+1 (234) 567-8900</div>
                    <div class="text-body-1">+1 (234) 567-8901</div>
                  </div>
                </div>
                <div class="d-flex align-start mb-4">
                  <v-icon color="primary" size="large" class="mr-3 mt-1">mdi-map-marker</v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">Dirección</div>
                    <div class="text-body-1">Calle Principal 123</div>
                    <div class="text-body-1">Ciudad, Estado 12345</div>
                  </div>
                </div>
                <div class="d-flex align-center">
                  <v-icon color="primary" size="large" class="mr-3">mdi-clock</v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">Horario de Atención</div>
                    <div class="text-body-1">Lunes a Viernes: 9:00 - 18:00</div>
                    <div class="text-body-1">Sábados: 10:00 - 14:00</div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-text class="pa-6">
              <h3 class="text-h5 mb-6">Envíanos un Mensaje</h3>

              <v-form @submit.prevent="sendEmail" ref="formRef">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Nombre completo"
                      variant="outlined"
                      v-model="formData.name"
                      :error-messages="errors.name"
                      @blur="validateField('name')"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Email"
                      variant="outlined"
                      type="email"
                      v-model="formData.email"
                      :error-messages="errors.email"
                      @blur="validateField('email')"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Asunto"
                      variant="outlined"
                      v-model="formData.subject"
                      :error-messages="errors.subject"
                      @blur="validateField('subject')"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      label="Mensaje"
                      variant="outlined"
                      rows="4"
                      v-model="formData.message"
                      :error-messages="errors.message"
                      @blur="validateField('message')"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      size="large"
                      class="w-100"
                      type="submit"
                      :loading="loading"
                    >
                      {{ loading ? 'Enviando...' : 'Enviar Mensaje' }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
        {{ snackbar.message }}
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import emailjs from '@emailjs/browser'

// Refs y estados
const formRef = ref()
const loading = ref(false)

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Función para mostrar mensajes
const showMessage = (message: string, color: 'success' | 'error') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Validaciones
const validateField = (field: keyof typeof formData) => {
  const value = formData[field]
  if (!value.trim()) {
    errors[field] = 'Este campo es requerido'
  } else if (field === 'email') {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    errors.email = pattern.test(value) ? '' : 'Email inválido'
  } else {
    errors[field] = ''
  }
}

const validateForm = (): boolean => {
  let isValid = true
  const fields: (keyof typeof formData)[] = ['name', 'email', 'subject', 'message']
  fields.forEach(field => {
    validateField(field)
    if (errors[field]) isValid = false
  })
  return isValid
}

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_l8h35i8',
  TEMPLATE_ID: 'template_7zncirt',
  PUBLIC_KEY: 'aLLW6NtjL_Xivl8c8'
}

// Envío del correo
const sendEmail = async () => {
  if (!validateForm()) {
    showMessage('Por favor, completa todos los campos correctamente.', 'error')
    return
  }

  loading.value = true

  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    )

    if (result.status === 200) {
      showMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success')
      resetForm()
    }
  } catch (error) {
    console.error('Error enviando email:', error)
    showMessage('Error al enviar el mensaje. Intenta nuevamente.', 'error')
  } finally {
    loading.value = false
  }
}

// Limpiar formulario
const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.subject = ''
  formData.message = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}
</script>
