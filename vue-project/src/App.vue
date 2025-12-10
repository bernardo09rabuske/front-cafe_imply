<template>
  <v-app class="app">

    <!-- Header aparece em todas as páginas, exceto login e cadastro -->
    <Header v-if="!isLoginPage && !isCadastroPage" />

    <v-main class="main-content">
      <router-view />
    </v-main>

    <Footer v-if="!isLoginPage" />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

const isLoginPage = computed(() => route.path === '/login')
const isCadastroPage = computed(() => route.path === '/cadastro')
</script>
