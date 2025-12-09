<template>
  <v-app class="app">
    <!-- Header, exceto na página de login -->
    <app-header v-if="!isLoginPage" />

    <v-main class="main-content">
      <router-view />
    </v-main>

    <!-- Footer opcional -->
    <app-footer v-if="!isLoginPage" />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/header.vue'
import AppFooter from './components/Footer.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>

<style scoped>
.app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #111; /* fundo preto */
  color: #fff8f0;
  min-height: 100vh;
}

.main-content {
  padding: 2rem;
}
</style>
