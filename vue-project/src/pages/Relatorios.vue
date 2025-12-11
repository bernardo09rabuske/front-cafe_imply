<template>
  <div class="admin-history-container">
    <h1>Histórico de Compras - Todos Usuários</h1>

    <div v-if="purchases.length === 0" class="empty">Nenhuma compra registrada</div>

    <div v-else>
      <div v-for="purchase in paginatedPurchases" :key="purchase.id" class="purchase-item">
        <span>{{ purchase.usuario.nome }}</span>
        <span>Café: {{ purchase.cafe_qtd }}</span>
        <span v-if="purchase.filtro_qtd > 0">Filtro: {{ purchase.filtro_qtd }}</span>
        <span>{{ formatDate(purchase.data_compra) }}</span>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="page === 1">Anterior</button>
        <span>Página {{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages">Próxima</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../controller/api';

interface User { id: string; nome: string; email: string; }
interface Purchase { id: string; usuario: User; cafe_qtd: number; filtro_qtd: number; data_compra: string }

const purchases = ref<Purchase[]>([]);
const page = ref(1);
const perPage = 10;

const totalPages = computed(() => Math.ceil(purchases.value.length / perPage));
const paginatedPurchases = computed(() => {
  const start = (page.value - 1) * perPage;
  return purchases.value.slice(start, start + perPage);
});

function nextPage() { if (page.value < totalPages.value) page.value++; }
function prevPage() { if (page.value > 1) page.value--; }
function formatDate(ts: string) {
  return new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

async function fetchPurchases() {
  try {
    const res = await api.get('/compras');
    purchases.value = res.data || [];
  } catch (err) {
    console.error('Erro ao buscar histórico admin:', err);
  }
}

onMounted(() => {
  fetchPurchases();
});
</script>

<style scoped>
/* Container principal das páginas */
.dashboard-container {
  max-width: 1000px;
  margin: 2rem auto;
  font-family: 'Roboto', sans-serif;
  color: white;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e1e1e;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 2px solid #ff9800;
}

.title-section h1 {
  margin: 0;
  color: #ff9800;
  font-size: 1.8rem;
}

.title-section p {
  margin: 0;
  color: #ccc;
  font-size: 0.9rem;
}

.user-section {
  text-align: right;
}

.user-section span {
  display: block;
}

.admin-badge {
  display: inline-block;
  margin-top: 0.2rem;
  padding: 0.2rem 0.6rem;
  background: #ff9800;
  color: black;
  font-weight: bold;
  border-radius: 6px;
  font-size: 0.75rem;
}

.user-email {
  color: #bbb;
  font-size: 0.85rem;
}

.user-section button {
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: red;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.user-section button:hover {
  background: #b71c1c;
}

/* Conteúdo principal */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Seções */
.section {
  background: #111;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #ff9800;
}

/* Títulos de seção */
.section h2 {
  color: #ff9800;
  margin-bottom: 1rem;
}

/* Lista de fila ou histórico */
.queue-person, .purchase {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #222;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.6rem;
}

.queue-person .person-info, .purchase {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Inputs editáveis (somente admin) */
.queue-person input {
  width: 60px;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #ff9800;
  background: #333;
  color: white;
  text-align: center;
}

/* Botões de ação (admin) */
.actions button {
  margin-left: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  transition: 0.2s;
}

.actions button:first-child {
  background: #ff9800;
  color: black;
}

.actions button:first-child:hover {
  background: #e68a00;
}

.actions button:last-child {
  background: red;
  color: white;
}

.actions button:last-child:hover {
  background: #b71c1c;
}

/* Mensagens de vazio */
.empty {
  text-align: center;
  color: #ccc;
  padding: 1rem;
  font-style: italic;
}

/* Paginação */
.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.4rem 0.8rem;
  background: #ff9800;
  color: black;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #e68a00;
}

/* Diferenciação visual do usuário comum */
.user-page .queue-person, 
.user-page .purchase {
  gap: 2rem;
}

.user-page .queue-person input,
.user-page .actions {
  display: none; /* remove inputs e botões para usuário */
}

</style>