<template>
  <section class="login">
    <h1>Iniciar Sesión</h1>

    <form class="formulario" @submit.prevent="iniciarSesion">
      <div class="campo">
        <label for="correo">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          v-model="correo"
          placeholder="ejemplo@email.com"
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

      <button type="submit" class="boton">Entrar</button>

      <p class="texto">
        ¿No tienes cuenta?
        <router-link to="/registro">Regístrate aquí</router-link>
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const correo = ref('')
const password = ref('')

function iniciarSesion() {
  console.log('Iniciando sesión con:', correo.value, password.value)
  alert('Inicio de sesión simulado (todavía no conectado al backend)')
}
</script>

<style scoped>
.login {
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

.texto {
  margin-top: 15px;
  text-align: center;
}
</style>