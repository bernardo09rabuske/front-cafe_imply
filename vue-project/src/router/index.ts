import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Cadastro from '../pages/Cadastro.vue'
import dashboardAdmin from '../pages/DashboardAdmin.vue'
import Relatorios from '../pages/Relatorios.vue'
import Historico from '../pages/Historico.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/cadastro', name: 'cadastro', component: Cadastro },
  { path: '/admin', name: 'dashboardAdmin', component: dashboardAdmin },
  { path: '/relatorios', name: 'relatorios', component: Relatorios },
  { path: '/historico', name: 'historico', component: Historico },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
