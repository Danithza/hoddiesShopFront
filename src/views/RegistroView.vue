<template>
  <section class="registro">
    <h1>Crear Cuenta</h1>

    <form class="formulario">
      <div class="campo">
        <label for="nombre">Nombre completo</label>
        <input type="text" id="nombre" placeholder="Tu nombre completo" />
      </div>

      <div class="campo">
        <label for="correo">Correo electrónico</label>
        <input type="email" id="correo" placeholder="ejemplo@email.com" />
      </div>

      <div class="campo">
        <label for="password">Contraseña</label>
        <input type="password" id="password" placeholder="••••••••" />
      </div>

      <button type="submit" class="boton">Registrarse</button>
    </form>
  </section>
</template>

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
</style>