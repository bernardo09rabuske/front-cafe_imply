<template>
  <div class="dashboard-container">
    <!-- HEADER -->
    <header class="dashboard-header">
      <div class="title-section">
        <h1>Dashboard Admin</h1>
        <p>Gerenciamento completo de café e filtro</p>
      </div>
      
    </header>

    <!-- FILA DE COMPRAS -->
    <section class="section">
      <h2>Fila de Compras</h2>

      <div v-if="queue.length === 0" class="empty">Fila vazia</div>

      <div v-else>
        <div v-for="(person, index) in queue" :key="person.id" class="queue-person">
          <div class="person-info">
            <span class="position">{{ index + 1 }}º - {{ person.usuario.nome }}</span>
            <span class="quantities">Café: {{ person.cafe_qtd }} | Filtro: {{ person.filtro_qtd }}</span>
          </div>

          <div class="actions">
            <button @click="abrirModalEditar(person)">Editar</button>
            <button @click="confirmPurchase(person)">Confirmar</button>
            <button @click="removeFromQueue(person.id)">Remover</button>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL DE EDIÇÃO -->
    <v-dialog v-model="modalEditarAberto" persistent max-width="400" v-if="usuarioEditar">
      <v-card>
        <v-card-title>Editar Compra</v-card-title>
        <v-card-text>
          <p>Usuário: <strong>{{ usuarioEditar.usuario.nome }}</strong></p>
          <p>Café: {{ usuarioEditar.cafe_qtd }}</p>
          <p>Filtro: {{ usuarioEditar.filtro_qtd }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="salvarEdicao">Salvar</v-btn>
          <v-btn color="red" @click="modalEditarAberto=false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- HISTÓRICO DE COMPRAS -->
    <section class="section">
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../controller/api';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
}

interface Fila {
  id: number;
  usuario_id: number;
  usuario: Usuario;
  cafe_qtd: number;
  filtro_qtd: number;
  posicao?: number;
}

interface Compra {
  id: number;
  usuario: Usuario;
  cafe_qtd: number;
  filtro_qtd: number;
  data_compra: string;
}


const currentUser = ref<Usuario>(JSON.parse(localStorage.getItem('user')!));


const queue = ref<Fila[]>([]);
const lastPurchases = ref<Compra[]>([]);


const modalEditarAberto = ref(false);
const usuarioEditar = ref<Fila | null>(null);


const page = ref(1);
const perPage = 10;
const totalPages = computed(() => Math.ceil(lastPurchases.value.length / perPage));
const paginatedPurchases = computed(() => {
  const start = (page.value - 1) * perPage;
  return lastPurchases.value.slice(start, start + perPage);
});

// FUNÇÕES
async function fetchQueue() {
  try {
    const res = await api.get('/fila', { headers: { 'X-User-Admin': 'true' } });
    queue.value = res.data.fila || [];
  } catch (err) {
    console.error('Erro ao buscar fila:', err);
  }
}

async function fetchPurchases() {
  try {
    const res = await api.get('/compras', { headers: { 'X-User-Admin': 'true' } });
    lastPurchases.value = res.data.resumo_ultimas || [];
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
  }
}

function abrirModalEditar(person: Fila) {
  usuarioEditar.value = { ...person };
  modalEditarAberto.value = true;
}

async function salvarEdicao() {
  if (!usuarioEditar.value) return;
  try {
    await api.put(`/compras/${usuarioEditar.value.id}`, {
      cafe_qtd: usuarioEditar.value.cafe_qtd,
      filtro_qtd: usuarioEditar.value.filtro_qtd
    }, { headers: { 'X-User-Admin': 'true' } });
    modalEditarAberto.value = false;
    fetchQueue();
    fetchPurchases();
  } catch (err) {
    console.error('Erro ao salvar edição:', err);
  }
}

async function confirmPurchase(pessoa: Fila) {
  try {
    await api.post('/compras', {
      usuario_id: pessoa.usuario_id,
      cafe_qtd: pessoa.cafe_qtd ?? 1,
      filtro_qtd: pessoa.filtro_qtd ?? 0
    }, { headers: { 'X-User-Admin': 'true' } });

    // Atualiza a fila e histórico depois do backend
    await fetchQueue();
    await fetchPurchases();
  } catch (err) {
    console.error('Erro ao confirmar compra:', err);
  }
}


async function removeFromQueue(id: number) {
  try {
    await api.delete(`/fila/excluir/${id}`, { headers: { 'X-User-Admin': 'true' } });
    queue.value = queue.value.filter(p => p.id !== id);
  } catch (err) {
    console.error('Erro ao remover usuário da fila:', err);
  }
}

// LOGOUT
function handleLogout() {
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// PAGINAÇÃO
function nextPage() { if (page.value < totalPages.value) page.value++; }
function prevPage() { if (page.value > 1) page.value--; }

// FORMATAÇÃO DE DATA
function formatDate(ts: string) {
  return new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

onMounted(() => {
  fetchQueue();
  fetchPurchases();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 2rem auto;
  font-family: 'Roboto', sans-serif;
  color: #fff;
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1E1E1E;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 2px solid #ff9800;
}

.title-section h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #ff9800;
}

.title-section p {
  margin: 0;
  font-size: 0.95rem;
  color: #bbb;
}

.user-section {
  text-align: right;
}

.user-section span {
  display: block;
  font-weight: 600;
}

.admin-badge {
  background: #ff9800;
  color: black;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 5px;
}

.user-email {
  color: #bbb;
  font-size: 0.85rem;
  margin: 2px 0 5px 0;
}

.user-section button {
  background: red;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.user-section button:hover {
  background: darkred;
}

/* SECTIONS */
.section {
  background: #111;
  border: 2px solid #ff9800;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.section h2 {
  margin-top: 0;
  color: #ff9800;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.empty {
  color: #bbb;
  text-align: center;
  padding: 1rem;
}

/* FILA */
.queue-person {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #222;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  transition: 0.2s;
}

.queue-person:hover {
  background: #333;
}

.person-info {
  display: flex;
  flex-direction: column;
}

.position {
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.quantities {
  font-size: 0.9rem;
  color: #ccc;
}

.actions button {
  margin-left: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
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
  background: darkred;
}

/* HISTÓRICO */
.purchase {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.8rem;
  border-bottom: 1px solid #333;
}

.purchase span {
  font-size: 0.9rem;
}

/* PAGINAÇÃO */
.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
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

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .user-section {
    text-align: left;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .queue-person {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
