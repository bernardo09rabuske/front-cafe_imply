<template>
  <v-app-bar app color="#1E1E1E" flat height="70">
    <v-container class="d-flex align-center justify-space-between">

      <!-- Logo / Título -->
      <div class="d-flex align-center" style="gap: 8px;">
        <v-icon size="32" color="white">mdi-coffee</v-icon>
        <h2 class="text-white" style="margin: 0;">Trade Coffe</h2>
      </div>

      <!-- Infos do usuário + logout -->
      <div class="d-flex align-center" style="gap: 16px;">
        
        <div class="text-right">
  <div class="text-white text-subtitle-2">
    {{ user?.nome }}
  </div>

  </div>
<div>
<div class="navigation-links">
          <v-btn text color="white" @click="$router.push('/')">Home</v-btn>
          <v-btn text color="white" @click="$router.push('/admin')">Dashboard</v-btn>
          <v-btn text color="white" @click="$router.push('/relatorios')">Relatórios</v-btn>
          <v-btn text color="white" @click="$router.push('/historico')">Histórico</v-btn>
</div>
</div>
        
        <v-avatar size="40" color="deep-purple-accent-4">
          <span class="white--text">
            {{ user?.nome?.charAt(0)?.toUpperCase() }}
          </span>
        </v-avatar>

        <!-- Logout -->
        <v-btn color="red" variant="flat" @click="logout">
          <v-icon start>mdi-logout</v-icon>
          Sair
        </v-btn>
      </div>

    </v-container>
  </v-app-bar>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref<any>(null)

// Busca o usuário logado salvo no localStorage
onMounted(() => {
  const savedUser = localStorage.getItem("user")
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
})

const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  router.push("/login")
}
</script>


<style scoped>
/* Container principal da App Bar */
.v-app-bar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid #2a2a2a;
}

/* Logo + ícone */
h2 {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Texto branco */
.text-white {
  color: #ffffff !important;
}

/* Texto cinza */
.text-grey {
  color: #b7b7b7 !important;
}

/* Área de usuário */
.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

/* Estilização do avatar */
.v-avatar {
  font-weight: 700;
  letter-spacing: 1px;
}

/* Botão de logout */
.v-btn {
  transition: 0.25s ease;
}

.v-btn:hover {
  background-color: #b71c1c !important;
  transform: translateY(-2px);
}

/* Responsividade */
@media (max-width: 600px) {
  h2 {
    font-size: 18px;
  }
  
  .v-app-bar {
    height: 60px !important;
  }

  .v-avatar {
    width: 32px !important;
    height: 32px !important;
    font-size: 0.8rem;
  }

  .v-btn {
    font-size: 0.75rem !important;
    padding: 0 10px !important;
  }
}
</style>
