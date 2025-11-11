<template>
  <v-main>
    <v-container class="py-10 categoria-container">
      <h1 class="text-h3 font-weight-bold text-center mb-4 categoria-titulo">
        Contáctanos
      </h1>

      <p class="text-h6 text-grey-darken-2 text-center mb-10">
        ¿Necesitas ayuda? Estamos aquí para responder todas tus preguntas.
      </p>

      <v-row>
        <!-- Información de contacto -->
        <v-col cols="12" md="6">
          <v-card class="pa-6 h-100" elevation="12">
            <h3 class="text-h5 font-weight-bold mb-6">Nuestros Contactos</h3>

            <div class="mb-6 d-flex align-center">
              <v-icon color="primary" size="large" class="mr-3">mdi-email</v-icon>
              <div>
                <div class="text-subtitle-1 font-weight-bold">Email</div>
                <div class="text-body-1">info@hoddieshop.com</div>
                <div class="text-body-1">ventas@hoddieshop.com</div>
              </div>
            </div>

            <div class="mb-6 d-flex align-center">
              <v-icon color="primary" size="large" class="mr-3">mdi-phone</v-icon>
              <div>
                <div class="text-subtitle-1 font-weight-bold">Teléfono</div>
                <div class="text-body-1">+1 (234) 567-8900</div>
                <div class="text-body-1">+1 (234) 567-8901</div>
              </div>
            </div>

            <div class="mb-6 d-flex align-start">
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
          </v-card>
        </v-col>

        <!-- Formulario -->
        <v-col cols="12" md="6">
          <v-card class="pa-6 h-100" elevation="12">
            <h3 class="text-h5 font-weight-bold mb-6">Envíanos un Mensaje</h3>

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
                    label="Correo electrónico"
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
                    class="w-100 mt-2"
                    type="submit"
                    :loading="loading"
                    elevation="2"
                  >
                    {{ loading ? 'Enviando...' : 'Enviar Mensaje' }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
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

// Mostrar mensajes
const showMessage = (message: string, color: 'success' | 'error') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Validar campos
const validateField = (field: keyof typeof formData) => {
  const value = formData[field].trim()

  if (!value) {
    errors[field] = 'Este campo es requerido'
    return
  }

  if (field === 'name') {
    const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/
    errors.name = namePattern.test(value)
      ? ''
      : 'El nombre solo puede contener letras y espacios'
    return
  }

  if (field === 'email') {
    // validación de formato
    const emailPattern = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/
    const domain = value.split('@')[1]?.toLowerCase() || ''
    const domainRegex = /^[a-z0-9-]+(\.[a-z]{2,})+$/

    if (!emailPattern.test(value)) {
      errors.email = 'Formato de email inválido'
      return
    }

    if (!domainRegex.test(domain) || /(.)\1{2,}/.test(domain) || /[0-9]{2,}/.test(domain)) {
      errors.email = 'Dominio de correo no válido'
      return
    }

    errors.email = ''
    return
  }

  errors[field] = ''
}

const validateForm = (): boolean => {
  let valid = true
  const fields: (keyof typeof formData)[] = ['name', 'email', 'subject', 'message']
  fields.forEach(f => {
    validateField(f)
    if (errors[f]) valid = false
  })
  return valid
}

// Configuración EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_l8h35i8',
  TEMPLATE_ID: 'template_7zncirt',
  PUBLIC_KEY: 'aLLW6NtjL_Xivl8c8'
}

// Enviar mensaje
const sendEmail = async () => {
  if (!validateForm()) {
    showMessage('Por favor completa todos los campos correctamente.', 'error')
    return
  }

  loading.value = true

  try {
    const res = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: `Nombre: ${formData.name}\nCorreo: ${formData.email}\n\nMensaje:\n${formData.message}`
      },
      EMAILJS_CONFIG.PUBLIC_KEY
    )

    if (res.status === 200) {
      showMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success')
      resetForm()
    }
  } catch (err) {
    console.error('Error al enviar:', err)
    showMessage('Error al enviar el mensaje. Intenta nuevamente.', 'error')
  } finally {
    loading.value = false
  }
}

// Reset
const resetForm = () => {
  Object.keys(formData).forEach(k => (formData[k as keyof typeof formData] = ''))
  Object.keys(errors).forEach(k => (errors[k as keyof typeof errors] = ''))
}
</script>

<style scoped>
.categoria-titulo {
  color: #1e40af;
}

.v-card {
  border-radius: 16px;
}

.v-btn {
  transition: none !important; /* sin movimiento */
}

.v-text-field,
.v-textarea {
  min-height: 90px;
}
</style>
