<template>
  <v-app class="app">
    <app-header v-if="irParaHome || isLoginPage" />
    <v-main class="main-content">
      <router-view />
    </v-main>

    
    <app-footer v-if="irParaHome" />
  </v-app>
</template>


<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import appHeader from './components/header.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
const irParaHome = computed(() => route.path === '/')
 
</script>



<style scoped>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}


nav {
  display: flex;
  gap: 1rem;
}

.logo {
  font-family: 'Georgia', serif;
  font-size: 1.8rem;
  font-weight: bold;
  cursor: pointer;
}

.rotas {
  display: flex;
  font-weight: 500;
  justify-content: space-evenly;
}

nav a {
  text-decoration: none;
  color: #007dfa;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.2s;
}

nav a:hover {
  background-color: #e0b93e;
  color: white;
}

.main {
  padding: 1rem;
}
</style>
