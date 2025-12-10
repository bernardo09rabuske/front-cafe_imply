<template>
  <div class="container">
    <div class="left-panel">
      <div class="welcome-text">
        <h1>Bem-vindo de volta!</h1>
        <p>Acesse sua conta para continuar acompanhando suas compras de café.</p>
      </div>
    </div>

    <div class="right-panel">
      <form class="login-form" @submit.prevent="handleLogin">
        <h2>Entrar</h2>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="seu@email.com"
            required
            :disabled="carregando"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            v-model="senha"
            placeholder="Sua senha"
            required
            :disabled="carregando"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="carregando">
          <span v-if="carregando">Entrando...</span>
          <span v-else>Entrar</span>
        </button>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <div class="signup-link">
          Ainda não tem conta?
          <router-link to="/cadastro">Criar conta</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../controller/api';

const router = useRouter();
const email = ref('');
const senha = ref('');
const errorMsg = ref('');
const carregando = ref(false);

const handleLogin = async () => {
  errorMsg.value = '';

  if (!email.value.trim() || !senha.value.trim()) {
    errorMsg.value = 'Preencha todos os campos.';
    return;
  }

  try {
    carregando.value = true;

    // Chamada para API de login
    const resposta = await api.post('/auth/login', {
      email: email.value,
      senha: senha.value
    });

    const token = resposta?.data?.token;
    const user = resposta?.data?.user;

    if (token && user) {
      // Salva token e usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Atualiza header do apiController para usar o token
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await router.push('/'); // redireciona para home
      return;
    }

    errorMsg.value = 'Resposta inválida do servidor.';
    console.error('Login: resposta sem token ou usuário', resposta);
  } catch (e: any) {
    console.error('Erro no login:', e);

    if (e.response) {
      const msg = e.response.data?.error || e.response.data?.message || `Erro ${e.response.status}`;
      errorMsg.value = msg;
    } else {
      errorMsg.value = 'Erro de conexão. Verifique sua API ou rede.';
    }
  } finally {
    carregando.value = false;
  }
};
</script>



<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  display: flex;
  width: 900px;
  height: 550px;
  margin: 2rem auto;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow: hidden;
}

/* PAINEL ESQUERDO */
.left-panel {
  flex: 1;
  padding: 50px;
  color: white;
  background: linear-gradient(135deg, #8b6b4c 0%, #a88c70 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.left-panel::before,
.left-panel::after {
  content: "";
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.left-panel::before {
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
}

.left-panel::after {
  bottom: -80px;
  left: -80px;
  width: 250px;
  height: 250px;
}

.welcome-text h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.welcome-text p {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
}

/* FORMULÁRIO */
.right-panel {
  flex: 1;
  padding: 50px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form h2 {
  color: #5d4037;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #5d4037;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #d7ccc8;
  font-size: 1rem;
  background: #faf7f2;
  transition: 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #8b6b4c;
  box-shadow: 0 0 0 2px rgba(139, 107, 76, 0.2);
}

.login-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  background: #8b6b4c;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 20px;
}

.login-btn:hover {
  background: #5d4037;
}

.signup-link {
  text-align: center;
  color: #5d4037;
}

.signup-link a {
  color: #8b6b4c;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  color: #5d4037;
  text-decoration: underline;
}

.error-msg {
  color: #d9534f;
  margin-bottom: 10px;
  text-align: center;
}
</style>
