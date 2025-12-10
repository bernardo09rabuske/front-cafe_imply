<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="title-section">
        <h1>Dashboard Admin</h1>
        <p>Gerenciamento completo de café e filtro</p>
      </div>
      <div class="user-section">
        <div>
          <span>{{ currentUser.nome }}</span>
          <span class="admin-badge">ADMIN</span>
          <p class="user-email">{{ currentUser.email }}</p>
        </div>
        <button @click="handleLogout" title="Sair">Sair</button>
      </div>
    </header>

    <div class="dashboard-content">
      <!-- Fila -->
      <div class="section">
        <h2>Fila de Compras</h2>
        <div v-if="queue.length === 0" class="empty">Fila vazia</div>
        <div v-else>
          <div v-for="(person, index) in queue" :key="person.id" class="queue-person">
            <div class="person-info">
              <span>{{ index + 1 }} - {{ person.usuario.nome }}</span>
              <div class="quantities">
                <input type="number" v-model.number="person.cafe_qtd" min="1" />
                <input type="number" v-model.number="person.filtro_qtd" min="0" />
              </div>
            </div>
            <div class="actions">
              <button @click="confirmPurchase(person)">Confirmar Compra</button>
              <button @click="removeFromQueue(person.id)">Remover</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Histórico -->
      <div class="section">
        <h2>Últimas Compras</h2>
        <div v-if="lastPurchases.length === 0" class="empty">Nenhuma compra registrada</div>
        <div v-else>
          <div v-for="purchase in paginatedPurchases" :key="purchase.id" class="purchase">
            <span>{{ purchase.usuario.nome }}</span>
            <span>Café: {{ purchase.cafe_qtd }}</span>
            <span v-if="purchase.filtro_qtd">Filtro: {{ purchase.filtro_qtd }}</span>
            <span>{{ formatDate(purchase.data_compra) }}</span>
          </div>
          <div class="pagination">
            <button @click="prevPage" :disabled="page === 1">Anterior</button>
            <span>Página {{ page }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="page === totalPages">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

interface User { id: string; nome: string; email: string; isAdmin: boolean }
interface QueuePerson { id: string; usuario_id: string; usuario: User; cafe_qtd: number; filtro_qtd: number }
interface Purchase { id: string; usuario: User; cafe_qtd: number; filtro_qtd: number; data_compra: string }

const currentUser = ref<User>(JSON.parse(localStorage.getItem('user')!));
const queue = ref<QueuePerson[]>([]);
const lastPurchases = ref<Purchase[]>([]);

const page = ref(1);
const perPage = 10;

const totalPages = computed(() => Math.ceil(lastPurchases.value.length / perPage));
const paginatedPurchases = computed(() => {
  const start = (page.value - 1) * perPage;
  return lastPurchases.value.slice(start, start + perPage);
});

const config = { headers: { 'X-User-Admin': 'true' } };

onMounted(() => { fetchQueue(); fetchPurchases(); });

async function fetchQueue() {
  try { const res = await axios.get('/api/fila/listar', config); queue.value = res.data.fila; }
  catch (err) { console.error(err); }
}

async function fetchPurchases() {
  try { const res = await axios.get('/api/compras/dashboard', config); lastPurchases.value = res.data.resumo_ultimas; }
  catch (err) { console.error(err); }
}

async function confirmPurchase(person: QueuePerson) {
  try {
    await axios.post('/api/compras/adicionar', {
      usuario_id: person.usuario_id,
      cafe_qtd: person.cafe_qtd,
      filtro_qtd: person.filtro_qtd
    }, config);

    await fetchQueue();
    await fetchPurchases();
  } catch (err) { console.error(err); }
}

async function removeFromQueue(id: string) {
  if (!confirm('Deseja realmente remover esse usuário da fila?')) return;
  try { await axios.delete(`/api/fila/excluir/${id}`, config); queue.value = queue.value.filter(p => p.id !== id); }
  catch (err) { console.error(err); }
}

function handleLogout() { localStorage.removeItem('user'); window.location.href = '/login'; }
function formatDate(ts: string) { return new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
function nextPage() { if (page.value < totalPages.value) page.value++ }
function prevPage() { if (page.value > 1) page.value-- }
</script>

