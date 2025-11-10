<template>
  <v-main class="register-background">
    <v-container class="register-container">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4">
          <!-- Tarjeta de Registro -->
          <v-card class="register-card" elevation="12" rounded="xl">
            <!-- Header del Registro -->
            <div class="register-header text-center pa-6">
              <div class="logo-circle mx-auto mb-4">
                <UserPlus class="icon-logo text-white" />
              </div>
              <h1 class="text-h4 font-weight-bold primary--text mb-2">
                Crear Cuenta
              </h1>
              <p class="text-body-1 text-grey-darken-1">
                Únete a HoddieShop y descubre lo último en moda
              </p>
            </div>

            <v-divider></v-divider>

            <!-- Formulario de Registro -->
            <form class="register-form pa-6" @submit.prevent="registrarUsuario">
              <!-- Nombre Completo -->
              <v-text-field
                v-model.trim="nombre"
                label="Nombre completo"
                type="text"
                placeholder="Tu nombre completo"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-account"
                color="primary"
                :error="!!nombreError"
                :error-messages="nombreError"
                :hide-details="false"
                class="mb-4"
                required
                @blur="validarNombre"
                @input="clearError('nombre')"
              ></v-text-field>

              <!-- Correo Electrónico -->
              <v-text-field
                v-model.trim="correo"
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@gmail.com"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-email"
                color="primary"
                :error="!!correoError"
                :error-messages="correoError"
                :hide-details="false"
                class="mb-4"
                required
                @blur="validarCorreo"
                @input="clearError('correo')"
              ></v-text-field>

              <!-- Contraseña -->
              <v-text-field
                v-model.trim="password"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                color="primary"
                :error="!!passwordError"
                :error-messages="passwordError"
                :hide-details="false"
                class="mb-2"
                @click:append-inner="showPassword = !showPassword"
                @blur="validarPassword"
                @input="clearError('password')"
                required
              ></v-text-field>

              <!-- Indicadores de fortaleza de contraseña -->
              <div class="password-strength mb-6">
                <div class="strength-bars">
                  <div
                    v-for="n in 4"
                    :key="n"
                    class="strength-bar"
                    :class="getStrengthClass(n)"
                  ></div>
                </div>
                <div class="text-caption text-grey-darken-2 mt-1">
                  {{ getPasswordStrengthText() }}
                </div>
              </div>

              <!-- Términos y condiciones -->
              <div class="terms-section mb-6">
                <v-checkbox
                  v-model="aceptoTerminos"
                  color="primary"
                  hide-details
                  class="mt-0"
                >
                  <template v-slot:label>
                    <span class="text-caption">
                      Acepto los
                      <a href="#" class="text-primary text-decoration-none">términos y condiciones</a>
                      y la
                      <a href="#" class="text-primary text-decoration-none">política de privacidad</a>
                    </span>
                  </template>
                </v-checkbox>
              </div>

              <!-- Botón de Registro -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="register-btn mb-4"
                rounded="pill"
                :loading="loading"
                :disabled="!aceptoTerminos"
              >
                <v-icon start>mdi-account-plus</v-icon>
                Crear Cuenta
              </v-btn>

              <v-divider class="my-4">o</v-divider>

              <!-- Botón para ir a Login -->
              <v-btn
                to="/login"
                color="secondary"
                variant="outlined"
                size="large"
                block
                class="login-btn"
                rounded="pill"
              >
                <v-icon start>mdi-login</v-icon>
                Iniciar Sesión
              </v-btn>

              <!-- Enlace de login -->
              <div class="text-center mt-4">
                <p class="text-body-2 text-grey-darken-2">
                  ¿Ya tienes cuenta?
                  <router-link
                    to="/login"
                    class="text-primary text-decoration-none font-weight-bold"
                  >
                    Inicia sesión aquí
                  </router-link>
                </p>
              </div>
            </form>
          </v-card>

          <!-- Información adicional -->
          <v-card class="benefits-card mt-6" variant="flat" color="grey-lighten-4">
            <v-card-text>
              <v-row align="center" justify="space-around">
                <v-col cols="auto" class="text-center">
                  <v-icon color="primary" class="mb-1">mdi-truck-fast</v-icon>
                  <div class="text-caption font-weight-medium">Envío Gratis</div>
                </v-col>
                <v-col cols="auto" class="text-center">
                  <v-icon color="primary" class="mb-1">mdi-tag</v-icon>
                  <div class="text-caption font-weight-medium">Ofertas Exclusivas</div>
                </v-col>
                <v-col cols="auto" class="text-center">
                  <v-icon color="primary" class="mb-1">mdi-heart</v-icon>
                  <div class="text-caption font-weight-medium">Favoritos</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { UserPlus } from 'lucide-vue-next'

const nombre = ref('')
const correo = ref('')
const password = ref('')
const aceptoTerminos = ref(false)
const showPassword = ref(false)
const loading = ref(false)

// Errores de validación
const nombreError = ref('')
const correoError = ref('')
const passwordError = ref('')

const router = useRouter()

// ✅ Regex igual al backend
const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z]+\.)+(com|co|net|org|edu|gov|info|io|es|mx|ar|cl|pe)$/
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40}$/

// Validaciones
const validarNombre = () => {
  if (!nombre.value) {
    nombreError.value = 'El nombre es requerido'
  } else if (!nameRegex.test(nombre.value)) {
    nombreError.value = 'El nombre solo puede contener letras y espacios (3-40 caracteres)'
  } else {
    nombreError.value = ''
  }
}

const validarCorreo = () => {
  if (!correo.value) {
    correoError.value = 'El correo es requerido'
  } else if (!emailRegex.test(correo.value)) {
    correoError.value = 'Correo electrónico no válido'
  } else {
    correoError.value = ''
  }
}

const validarPassword = () => {
  if (!password.value) {
    passwordError.value = 'La contraseña es requerida'
  } else if (password.value.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres'
  } else {
    passwordError.value = ''
  }
}

const clearError = (field: string) => {
  if (field === 'nombre') nombreError.value = ''
  if (field === 'correo') correoError.value = ''
  if (field === 'password') passwordError.value = ''
}

// Fortaleza de contraseña
const passwordStrength = computed(() => {
  if (!password.value) return 0
  let strength = 0
  if (password.value.length >= 6) strength++
  if (password.value.length >= 8) strength++
  if (/[A-Z]/.test(password.value)) strength++
  if (/[0-9]/.test(password.value)) strength++
  if (/[^A-Za-z0-9]/.test(password.value)) strength++
  return Math.min(strength, 4)
})

const getStrengthClass = (n: number) => {
  if (n <= passwordStrength.value) {
    const colors = ['error', 'warning', 'info', 'success']
    return colors[passwordStrength.value - 1]
  }
  return 'grey-lighten-2'
}

const getPasswordStrengthText = () => {
  const texts = [
    'Muy débil',
    'Débil',
    'Moderada',
    'Fuerte',
    'Muy fuerte'
  ]
  return texts[passwordStrength.value]
}

// Registro de usuario
async function registrarUsuario() {
  // Validar todos los campos
  validarNombre()
  validarCorreo()
  validarPassword()

  if (nombreError.value || correoError.value || passwordError.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos inválidos',
      text: 'Por favor corrige los errores en el formulario.',
      confirmButtonColor: '#6d28d9',
      background: '#f8fafc',
      color: '#1f2937',
    })
    return
  }

  if (!aceptoTerminos.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Términos y condiciones',
      text: 'Debes aceptar los términos y condiciones para continuar.',
      confirmButtonColor: '#6d28d9',
      background: '#f8fafc',
      color: '#1f2937',
    })
    return
  }

  try {
    loading.value = true

    const res = await axios.post('http://localhost:3333/register', {
      fullName: nombre.value,
      email: correo.value,
      password: password.value,
    })

    await Swal.fire({
      icon: 'success',
      title: '¡Cuenta creada! 🎉',
      text: 'Tu registro se ha completado exitosamente. Ya puedes iniciar sesión.',
      confirmButtonColor: '#6d28d9',
      background: '#f8fafc',
      color: '#1f2937',
    })

    // Limpiar formulario
    nombre.value = ''
    correo.value = ''
    password.value = ''
    aceptoTerminos.value = false

    // Redirigir al login
    router.push('/login')
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Error al registrar usuario.'

    Swal.fire({
      icon: 'error',
      title: 'Error en el registro',
      text: errorMessage,
      confirmButtonColor: '#6d28d9',
      background: '#f8fafc',
      color: '#1f2937',
    })

    // Limpiar campos si el error no es de validación
    if (!errorMessage.includes('válido') && !errorMessage.includes('registrado')) {
      nombre.value = ''
      correo.value = ''
      password.value = ''
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-background {
  background: linear-gradient(135deg, #ede9fe 0%, #f9fafb 50%, #e0e7ff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.register-container {
  max-width: 1200px;
}

.register-card {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.register-header {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6d28d9, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.logo-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.4);
}

.icon-logo {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.register-form {
  background: white;
}

/* Indicadores de fortaleza de contraseña */
.password-strength {
  padding: 0 8px;
}

.strength-bars {
  display: flex;
  gap: 4px;
  height: 4px;
}

.strength-bar {
  flex: 1;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Botones mejorados */
.register-btn {
  background: linear-gradient(90deg, #6d28d9, #3b82f6) !important;
  color: white !important;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.register-btn:hover:not(.v-btn--disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.register-btn.v-btn--disabled {
  background: #9ca3af !important;
  box-shadow: none;
}

.login-btn {
  border: 2px solid #3b82f6 !important;
  color: #3b82f6 !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: #3b82f6 !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

/* Campos de formulario mejorados */
:deep(.v-field--outlined) {
  border-radius: 12px !important;
}

:deep(.v-field__outline) {
  color: #d1d5db !important;
}

:deep(.v-field--focused .v-field__outline) {
  color: #6d28d9 !important;
}

/* Tarjeta de beneficios */
.benefits-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.benefits-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Términos y condiciones */
.terms-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

/* Animaciones */
.register-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .register-container {
    padding: 16px;
  }

  .register-card {
    margin: 8px;
  }

  .logo-circle {
    width: 60px;
    height: 60px;
  }

  .icon-logo {
    width: 24px;
    height: 24px;
  }

  .benefits-card .v-row {
    justify-content: center;
  }
}
</style>
