<template>
  <header>
    <div class="logo" @click="irParaHome">CaféSabor</div>
    <div class="form">
      <div>
    <label class="nome" for="nome">Nome Completo</label>
    <input type="text" id="nome" name="nome">
        </div>
        <div>
    <label class="email" for="email">E-mail</label>
    <input type="email" id="email" name="email">
          </div>
          <div>
    <label class="senha" for="senha">Senha</label>
    <input type="password" id="senha" name="senha">
        </div>
 </div>
    <div class="actions">
      <a href="/login" class="btn-login">Login</a>
      <a href="/cadastro" class="btn-cadastrar">Cadastrar-se</a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const irParaHome = () => {
  router.push('/')
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background: linear-gradient(135deg, #8b6b4c 0%, #a88c70 100%);
  color: #fff8f0;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}
.form {
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-items: flex-start;
}

.nome, .email, .senha {
  margin-bottom: 10px;
  
}

.logo {
  font-family: 'Georgia', serif;
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
}

nav ul {
  display: flex;
  gap: 30px;
  list-style: none;
}

nav ul li a {
  text-decoration: none;
  color: #fff8f0;
  font-weight: 500;
  transition: color 0.3s;
}

nav ul li a:hover {
  color: #fff2e6;
}

.actions {
  display: flex;
  gap: 15px;
}

.btn-login, .btn-cadastrar {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-login {
  background-color: #fff8f0;
  color: #5d4037;
}

.btn-login:hover {
  background-color: #f0e6db;
}

.btn-cadastrar {
  background-color: #5d4037;
  color: #fff8f0;
}

.btn-cadastrar:hover {
  background-color: #8b6b4c;
}
</style>
