<template>
  <div class="container">
    <div class="left-panel">
      <div class="welcome-text">
        <h1>Bem-vindo!</h1>
        <p>Crie sua conta para acessar recursos exclusivos e registrar suas compras de café.</p>
      </div>
    </div>

    <div class="right-panel">
      <form class="login-form" @submit.prevent="handleSubmit">
        <h2>Cadastrar</h2>

        <div class="form-group">
          <label for="name">Nome</label>
          <input type="text" id="name" v-model="nome" placeholder="Seu nome completo" required />
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="email" placeholder="seu@email.com" required />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="senha" placeholder="Sua senha" required />
        </div>

        <div class="form-group">
          <label for="passwordConfirmation">Confirme a Senha</label>
          <input type="password" id="passwordConfirmation" v-model="confirmarSenha" placeholder="Confirme a senha" required />
        </div>

        <button type="submit" class="login-btn">Cadastrar</button>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <div class="signup-link">
          Já tem uma conta? <router-link to="/login">Faça login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../controller/api'

const router = useRouter()
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const errorMsg = ref('')
const nome = ref('')
const carregando = ref(false)
const mostrarSenha = ref(false)

const getForcaSenha = (senhaStr: string): { strength: number; color: string; text: string } => {
  let strength = 0
  if (!senhaStr) return { strength: 0, color: 'error', text: 'Muito fraca' }

  if (senhaStr.length >= 8) strength++
  if (/[A-Z]/.test(senhaStr)) strength++
  if (/[a-z]/.test(senhaStr)) strength++
  if (/[0-9]/.test(senhaStr)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(senhaStr)) strength++
  if (senhaStr.length >= 12) strength++

  const mapa = {
    0: { color: 'error', text: 'Muito fraca' },
    1: { color: 'error', text: 'Fraca' },
    2: { color: 'warning', text: 'Média' },
    3: { color: 'info', text: 'Boa' },
    4: { color: 'success', text: 'Forte' },
    5: { color: 'success', text: 'Muito forte' },
    6: { color: 'success', text: 'Excelente' }
  } as Record<number, { color: string; text: string }>

  return {
    strength,
    color: mapa[strength]?.color || 'error',
    text: mapa[strength]?.text || 'Muito fraca'
  }
}
const regrasSenha = [
  (v: string) => !!v || 'Senha é obrigatória',
  (v: string) => v.length >= 8 || 'Senha deve ter no mínimo 8 caracteres',
  (v: string) => /[A-Z]/.test(v) || 'Senha deve conter pelo menos uma letra maiúscula',
  (v: string) => /[a-z]/.test(v) || 'Senha deve conter pelo menos uma letra minúscula',
  (v: string) => /[0-9]/.test(v) || 'Senha deve conter pelo menos um número',
  (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Senha deve conter pelo menos um caractere especial',
  (v: string) => !/\s/.test(v) || 'Senha não pode conter espaços em branco',
  (v: string) => {
    const hasSequential = /(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(v)
    return !hasSequential || 'Senha não pode conter sequências numéricas'
  },
  (v: string) => {
    const hasRepeating = /(.)\1{2,}/.test(v)
    return !hasRepeating || 'Senha não pode conter caracteres repetidos em sequência'
  }
]
function validarFormulario(): boolean {
  errorMsg.value = ''
  if (!nome.value.trim()) {
    errorMsg.value = 'Nome é obrigatório.'
    return false
  }
  if (!email.value.trim()) {
    errorMsg.value = 'E-mail é obrigatório.'
    return false
  }
  // Simples validação de e-mail
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorMsg.value = 'E-mail inválido.'
    return false
  }
  if (!senha.value) {
    errorMsg.value = 'Senha é obrigatória.'
    return false
  }
  for (const regra of regrasSenha) {
    const resultado = regra(senha.value)
    if (resultado !== true) {
      errorMsg.value = resultado
      return false
    }
  }
  if (senha.value !== confirmarSenha.value) {
    errorMsg.value = 'As senhas não coincidem.'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validarFormulario()) return

  carregando.value = true
  errorMsg.value = ''

  try {
    await api.post('/usuario', {
      nome: nome.value,
      email: email.value,
      senha: senha.value
    })
    router.push('/login')
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg.value = error.response.data.message
    } else {
      errorMsg.value = 'Erro ao cadastrar. Tente novamente mais tarde.'
    }
  } finally {
    carregando.value = false
  }
}
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
  height: 100%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow: hidden;
  margin: 2rem auto;
}

.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #8b6b4c 0%, #a88c70 100%);
  color: white;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.left-panel::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.left-panel::after {
  content: "";
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 250px;
  height: 250px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.welcome-text h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.welcome-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.right-panel {
  flex: 1;
  background-color: white;
  padding: 50px;
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
  border: 1px solid #d7ccc8;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #faf7f2;
}

.form-group input:focus {
  outline: none;
  border-color: #8b6b4c;
  box-shadow: 0 0 0 2px rgba(139, 107, 76, 0.2);
}

.login-btn {
  background-color: #8b6b4c;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-bottom: 20px;
}

.login-btn:hover {
  background-color: #5d4037;
}

.signup-link {
  text-align: center;
  color: #5d4037;
}

.signup-link a {
  color: #8b6b4c;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: #5d4037;
  text-decoration: underline;
}
</style>
