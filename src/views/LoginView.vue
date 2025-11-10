<template>
  <v-main class="login-background">
    <v-container class="login-container">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4">
          <!-- Tarjeta de Login -->
          <v-card class="login-card" elevation="12" rounded="xl">
            <!-- Header del Login -->
            <div class="login-header text-center pa-6">
              <div class="logo-circle mx-auto mb-4">
                <Shirt class="icon-logo text-white" />
              </div>
              <h1 class="text-h4 font-weight-bold primary--text mb-2">
                Iniciar Sesión
              </h1>
              <p class="text-body-1 text-grey-darken-1">
                Accede a tu cuenta de HoddieShop
              </p>
            </div>

            <v-divider></v-divider>

            <!-- Usuario Logueado -->
            <div v-if="usuario" class="user-logged-in pa-6 text-center">
              <v-avatar color="primary" size="64" class="mb-4">
                <span class="text-h5 white--text">
                  {{ usuario.fullName?.charAt(0) }}
                </span>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold mb-2">
                ¡Hola, {{ usuario.fullName }}! 👋
              </h3>
              <p class="text-body-2 text-grey-darken-2 mb-4">
                Has iniciado sesión correctamente
              </p>
              <v-btn
                color="error"
                variant="outlined"
                class="logout-btn"
                @click="cerrarSesion"
                rounded="pill"
                size="large"
              >
                <v-icon start>mdi-logout</v-icon>
                Cerrar Sesión
              </v-btn>
            </div>

            <!-- Formulario de Login -->
            <form v-else class="login-form pa-6" @submit.prevent="iniciarSesion">
              <v-text-field
                v-model.trim="correo"
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@email.com"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-email"
                color="primary"
                :hide-details="false"
                class="mb-4"
                required
              ></v-text-field>

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
                :hide-details="false"
                class="mb-2"
                @click:append-inner="showPassword = !showPassword"
                required
              ></v-text-field>

              <div class="d-flex justify-end mb-6">
                <a href="#" class="text-caption text-primary text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="login-btn mb-4"
                rounded="pill"
                :loading="loading"
              >
                <v-icon start>mdi-login</v-icon>
                Iniciar Sesión
              </v-btn>

              <v-divider class="my-4">o</v-divider>

              <v-btn
                to="/registro"
                color="secondary"
                variant="outlined"
                size="large"
                block
                class="register-btn"
                rounded="pill"
              >
                <v-icon start>mdi-account-plus</v-icon>
                Crear Cuenta
              </v-btn>

              <div class="text-center mt-4">
                <p class="text-body-2 text-grey-darken-2">
                  ¿No tienes cuenta?
                  <router-link
                    to="/registro"
                    class="text-primary text-decoration-none font-weight-bold"
                  >
                    Regístrate aquí
                  </router-link>
                </p>
              </div>
            </form>
          </v-card>

          <!-- Información adicional -->
          <v-card class="info-card mt-6" variant="flat" color="grey-lighten-4">
            <v-card-text class="text-center">
              <div class="d-flex justify-center align-center">
                <v-icon color="primary" class="mr-2">mdi-shield-check</v-icon>
                <span class="text-caption text-grey-darken-2">
                  Tus datos están protegidos y seguros
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { Shirt } from 'lucide-vue-next'

const correo = ref('')
const password = ref('')
const usuario = ref(null)
const showPassword = ref(false)
const loading = ref(false)
const router = useRouter()

// 🔹 Verificar si ya hay usuario logueado
onMounted(() => {
  const storedUser = localStorage.getItem('usuario')
  if (storedUser) {
    usuario.value = JSON.parse(storedUser)
  }
})

// 🔹 Iniciar sesión
async function iniciarSesion() {
  try {
    if (!correo.value || !password.value) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor ingresa tus datos.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
      return
    }

    loading.value = true

    const res = await axios.post('http://localhost:3333/login', {
      email: correo.value,
      password: password.value,
    })

    // Guardar token y usuario en localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.user))
    usuario.value = res.data.user

    await Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: `Inicio de sesión exitoso, ${res.data.user.fullName}.`,
      timer: 2000,
      showConfirmButton: false,
      background: '#f8fafc',
      color: '#1f2937',
    })

    router.push('/')
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al iniciar sesión',
      text: err.response?.data?.message || 'Correo o contraseña incorrectos. Intenta nuevamente.',
      confirmButtonColor: '#6d28d9',
      background: '#f8fafc',
      color: '#1f2937',
    })
  } finally {
    loading.value = false
  }
}

// 🔹 Cerrar sesión
function cerrarSesion() {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Estás seguro de que quieres salir de tu cuenta?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#6d28d9',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    background: '#f8fafc',
    color: '#1f2937',
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      usuario.value = null

      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente.',
        timer: 2000,
        showConfirmButton: false,
        background: '#f8fafc',
        color: '#1f2937',
      })
    }
  })
}
</script>

<style scoped>
.login-background {
  background: linear-gradient(135deg, #ede9fe 0%, #f9fafb 50%, #e0e7ff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.login-container {
  max-width: 1200px;
}

.login-card {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.login-header {
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

.user-logged-in {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 0 0 16px 16px;
}

.login-form {
  background: white;
}

/* Botones mejorados */
.login-btn {
  background: linear-gradient(90deg, #6d28d9, #3b82f6) !important;
  color: white !important;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.logout-btn {
  border: 2px solid #dc2626 !important;
  color: #dc2626 !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #dc2626 !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.register-btn {
  border: 2px solid #3b82f6 !important;
  color: #3b82f6 !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.register-btn:hover {
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

/* Tarjeta de información */
.info-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Animaciones */
.login-card {
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
  .login-container {
    padding: 16px;
  }

  .login-card {
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
}
</style>
