<template>
  <v-app-bar
    app
    flat
    height="80"
    color="#ff7f00"  
    dark
    class="header"
  >
    <!-- Ícone menu mobile -->
    <v-app-bar-nav-icon @click="drawer = !drawer" />

    <!-- Logo -->
    <v-toolbar-title class="logo" @click="goHome">
      CaféSabor
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Links desktop -->
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

  <!-- Drawer mobile -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    right
    color="#1a1a1a" 
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

const goHome = () => router.push('/')

const menuItems = [
  { title: 'Home', to: '/' },
  { title: 'Login', to: '/login' },
  { title: 'Cadastrar', to: '/cadastrar' },
]
</script>

<style scoped>
.header {
  font-family: 'Georgia', serif;
  font-weight: bold;
}

.logo {
  font-size: 1.8rem;
  cursor: pointer;
  color: #fff;
}

.menu-btn {
  color: #fff;
  font-weight: 600;
  transition: all 0.3s;
}

.menu-btn:hover {
  color: #000;
  background-color: #ffc266;
  border-radius: 8px;
}

.v-navigation-drawer {
  font-family: 'Segoe UI', sans-serif;
}

.v-list-item-title {
  font-weight: 500;
  color: #ff7f00;
}
</style>
