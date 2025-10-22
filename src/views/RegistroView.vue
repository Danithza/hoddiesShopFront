<template>
  <section class="registro">
    <h1>Crear Cuenta</h1>

    <form class="formulario" @submit.prevent="registrarUsuario">
      <div class="campo">
        <label for="nombre">Nombre completo</label>
        <input
          type="text"
          id="nombre"
          v-model="nombre"
          placeholder="Tu nombre completo"
          required
        />
      </div>

      <div class="campo">
        <label for="correo">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          v-model="correo"
          placeholder="ejemplo@gmail.com"
          required
        />
      </div>

      <div class="campo">
        <label for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" class="boton">Registrarse</button>
    </form>

    <!-- Mensaje moderno -->
    <transition name="fade">
      <div v-if="mensaje" :class="['toast', error ? 'error' : 'exito']">
        {{ mensaje }}
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const nombre = ref('')
const correo = ref('')
const password = ref('')
const mensaje = ref('')
const error = ref(false)

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40}$/

async function registrarUsuario() {
  // Validación frontend rápida
  if (!nameRegex.test(nombre.value)) {
    mostrarMensaje('El nombre solo puede contener letras y espacios.', true)
    return
  }
  if (!emailRegex.test(correo.value)) {
    mostrarMensaje('Correo electrónico no válido.', true)
    return
  }
  if (password.value.length < 6) {
    mostrarMensaje('La contraseña debe tener al menos 6 caracteres.', true)
    return
  }

  try {
    const res = await axios.post('http://localhost:3333/register', {
      fullName: nombre.value,
      email: correo.value,
      password: password.value,
    })

    mostrarMensaje('🎉 Registro exitoso, ya puedes iniciar sesión.', false)
    nombre.value = ''
    correo.value = ''
    password.value = ''
  } catch (err) {
    mostrarMensaje(err.response?.data?.error || 'Error al registrar usuario.', true)
  }
}

function mostrarMensaje(texto: string, esError = false) {
  mensaje.value = texto
  error.value = esError
  setTimeout(() => (mensaje.value = ''), 4000)
}
</script>

<style scoped>
.registro {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
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

/* Mensaje flotante */
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 15px 25px;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  animation: fadeIn 0.3s;
}

.exito {
  background-color: #16a34a;
}

.error {
  background-color: #dc2626;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
