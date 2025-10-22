<template>
  <section class="login">
    <h1>Iniciar Sesión</h1>

    <!-- Mostrar botón si ya está logueado -->
    <div v-if="usuario">
      <p>👋 Hola, {{ usuario.fullName }}</p>
      <button class="boton salir" @click="cerrarSesion">Cerrar sesión</button>
    </div>

    <!-- Mostrar formulario si no hay usuario -->
    <form v-else class="formulario" @submit.prevent="iniciarSesion">
      <div class="campo">
        <label for="correo">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          v-model.trim="correo"
          placeholder="ejemplo@email.com"
          required
        />
      </div>

      <div class="campo">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model.trim="password"
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" class="boton">Entrar</button>

      <p class="texto">
        ¿No tienes cuenta?
        <router-link to="/registro">Regístrate aquí</router-link>
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const correo = ref('')
const password = ref('')
const usuario = ref(null)
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
      Swal.fire('⚠️ Campos vacíos', 'Por favor ingresa tus datos.', 'warning')
      return
    }

    const res = await axios.post('http://localhost:3333/login', {
      email: correo.value,
      password: password.value,
    })

    // Guardar token y usuario en localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.user))
    usuario.value = res.data.user

    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: `Inicio de sesión exitoso, ${res.data.user.fullName}.`,
      timer: 2000,
      showConfirmButton: false,
    })

    router.push('/')
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text:
        err.response?.data?.message ||
        'Correo o contraseña incorrectos. Intenta nuevamente.',
    })
  }
}

// 🔹 Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  usuario.value = null

  Swal.fire({
    icon: 'info',
    title: 'Sesión cerrada',
    text: 'Has cerrado sesión correctamente.',
    timer: 2000,
    showConfirmButton: false,
  })
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  animation: fadeIn 0.5s ease;
}

h1 {
  font-size: 2rem;
  color: #1e40af;
  margin-bottom: 30px;
}

.formulario {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border 0.3s;
}

input:focus {
  border-color: #1e40af;
  outline: none;
}

.boton {
  background-color: #1e40af;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  width: 100%;
}

.boton:hover {
  background-color: #3b82f6;
}

.salir {
  background-color: #dc2626;
  width: auto;
  margin-top: 10px;
}

.salir:hover {
  background-color: #ef4444;
}

.texto {
  margin-top: 15px;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
