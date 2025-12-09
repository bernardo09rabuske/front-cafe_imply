<template>
  <v-app-bar
    app
    flat
    height="100"
    color="deep-purple lighten-3"
    class="header"
  >
    <!-- Ícone do menu para mobile -->
    <v-app-bar-nav-icon @click="drawer = !drawer" class="me-2" />

    <!-- Logo -->
    <v-toolbar-title
      class="logo"
      @click="irParaHome"
    >
      CaféSabor
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Links do menu (desktop) -->
    <v-btn
      text
      v-for="item in menuItems"
      :key="item.title"
      :to="item.to"
      class="menu-btn"
    >
      {{ item.title }}
    </v-btn>
  </v-app-bar>

  <!-- Drawer para mobile -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    right
    color="deep-purple lighten-5"
    app
  >
    <v-list nav dense>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="item.to"
        link
        @click="drawer = false"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(false)

const irParaHome = () => {
  router.push('/')
}

// Menu principal
const menuItems = [
  { title: 'Home', to: '/' },
  { title: 'Cardápio', to: '/cardapio' },
  { title: 'Sobre', to: '/sobre' },
  { title: 'Contato', to: '/contato' },
  { title: 'Login', to: '/login' },
  { title: 'Cadastrar', to: '/cadastrar' },
]
</script>

<style scoped>
.header {
  font-family: 'Georgia', serif;
  font-weight: bold;
  color: #fff8f0;
}

.logo {
  font-size: 1.8rem;
  cursor: pointer;
}

.menu-btn {
  color: #fff8f0;
  font-weight: 600;
  transition: all 0.3s;
}

.menu-btn:hover {
  color: #ffd699;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.v-navigation-drawer {
  font-family: 'Segoe UI', sans-serif;
}

.v-list-item-title {
  font-weight: 500;
  color: #5d4037;
}
</style>
