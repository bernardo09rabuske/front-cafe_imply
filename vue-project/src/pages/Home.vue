<template>
    <div>
      <h1>Home</h1>
      <p v-if="token">Você está logado!</p>
      <p v-else>Faça login para continuar</p>
    </div>
</template>


<script setup lang="ts">
const token = localStorage.getItem('token')
</script>


