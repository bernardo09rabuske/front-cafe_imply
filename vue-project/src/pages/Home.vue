<template>
  <div class="home-container">
    <!-- Header -->
    <app-header />

    <!-- Tabs -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'queue' }" @click="activeTab = 'queue'">Fila</button>
      <button :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">Histórico</button>
    </div>

    <div class="tab-content">
      <!-- Fila -->
      <div v-if="activeTab === 'queue'">
        <div class="join-queue">
          <h2>{{ isInQueue ? 'Você está na fila' : 'Entrar na fila' }}</h2>
          <div v-if="!isInQueue" class="inputs">
            <label>Café</label>
            <input type="number" min="1" v-model.number="coffeeQuantity" />
            <label>Filtro</label>
            <input type="number" min="0" v-model.number="filterQuantity" />
          </div>
          <button @click="toggleQueue" :class="isInQueue ? 'leave' : 'enter'">
            {{ isInQueue ? 'Sair da fila' : 'Entrar na fila' }}
          </button>
        </div>

        <div class="queue-list">
          <h3>Fila de Compras ({{ queue.length }})</h3>
          <div v-if="queue.length === 0" class="empty-queue">Fila vazia - Seja o primeiro!</div>
          <div v-else>
            <div
              v-for="(person, index) in queue"
              :key="person.id"
              :class="['queue-person', index === 0 ? 'next' : '']"
            >
              <div class="person-info">
                <span v-if="index === 0" class="next-label">PRÓXIMO</span>
                <span>{{ person.usuario.nome }}</span>
                <div class="quantities">
                  <span>Café: {{ person.cafe_qtd ?? person.compra?.cafe_qtd ?? 0 }}</span>
                 <span v-if="((person.filtro_qtd ?? person.compra?.filtro_qtd) ?? 0) > 0">
                  Filtro: {{ person.filtro_qtd ?? person.compra?.filtro_qtd }}
                  </span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Histórico -->
      <div v-else>
        <h2>Histórico de Compras</h2>
        <div v-if="purchases.length === 0" class="empty-history">Nenhuma compra registrada ainda</div>
        <div v-else>
          <div v-for="purchase in paginatedPurchases" :key="purchase.id" class="purchase">
            <span>{{ purchase.usuario?.nome ?? 'Desconhecido' }}</span>
            <span>Café: {{ purchase.cafe_qtd }}</span>
            <span v-if="purchase.filtro_qtd > 0">Filtro: {{ purchase.filtro_qtd }}</span>
            <span>{{ formatDate(purchase.data_compra) }}</span>
          </div>

          <!-- Paginação -->
          <div class="pagination" v-if="totalPages > 1">
            <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
            <span>Página {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Próximo</button>
          </div>
        </div>
      </div>
    </div>
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

interface Compra {
  id: number;
  usuario_id: number;
  cafe_qtd: number;
  filtro_qtd: number;
  data_compra: string;
  usuario?: Usuario;
}

interface Fila {
  id: number;
  usuario_id: number;
  usuario: Usuario;
  posicao: number;
  ativo: boolean;
  cafe_qtd?: number; // direto da fila
  filtro_qtd?: number; // direto da fila
  compra?: Compra;
}

const currentUser = ref<Usuario>(JSON.parse(localStorage.getItem('user')!));
const queue = ref<Fila[]>([]);
const purchases = ref<Compra[]>([]);
const coffeeQuantity = ref(1);
const filterQuantity = ref(0);
const isInQueue = ref(false);
const activeTab = ref<'queue' | 'history'>('queue');

// Paginação
const currentPage = ref(1);
const perPage = 10;
const totalPages = computed(() => Math.ceil(purchases.value.length / perPage));
const paginatedPurchases = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return purchases.value.slice(start, start + perPage);
});

function prevPage() { if(currentPage.value > 1) currentPage.value--; }
function nextPage() { if(currentPage.value < totalPages.value) currentPage.value++; }

async function fetchQueue() {
  try {
    const res = await api.get('/fila');
    queue.value = res.data.fila;

    // Verifica se o usuário está na fila
    isInQueue.value = queue.value.some(p => p.usuario_id === currentUser.value.id);

    // Puxa café/filtro direto da compra relacionada, se existir
    queue.value.forEach(f => {
      if (!f.cafe_qtd && f.compra) {
        f.cafe_qtd = f.compra.cafe_qtd;
        f.filtro_qtd = f.compra.filtro_qtd;
      }
    });
  } catch (err) {
    console.error('Erro ao buscar fila:', err);
  }
}

async function fetchPurchases() {
  try {
    const res = await api.get(`/compras?usuario_id=${currentUser.value.id}`);
    purchases.value = res.data || [];
  } catch (err) {
    console.error('Erro ao buscar compras:', err);
  }
}

async function toggleQueue() {
  try {
    if (isInQueue.value) {
      await api.delete(`/fila/${currentUser.value.id}`);
    } else {
      await api.post(`/fila/${currentUser.value.id}`, {
        cafe_qtd: coffeeQuantity.value,
        filtro_qtd: filterQuantity.value
      });
    }
    await fetchQueue();
    await fetchPurchases();
  } catch (err) {
    console.error(err);
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
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
.home-container { max-width: 900px; margin: 2rem auto; }
.tabs { display: flex; margin-bottom: 1rem; }
.tabs button { flex: 1; padding: 0.8rem; background: #000; color: #ff9800; border: none; cursor: pointer; }
.tabs button.active { background: #ff9800; color: black; }
.tab-content { color: white; }
.join-queue { background: #111; border: 2px solid #ff9800; padding: 1rem; margin-bottom: 1rem; border-radius: 12px; }
.join-queue input { width: 100%; margin: 0.3rem 0 0.5rem 0; padding: 0.5rem; border-radius: 6px; border: 1px solid #ff9800; background: #222; color: white; }
.join-queue button.enter { background: #ff9800; color: black; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; }
.join-queue button.leave { background: red; color: white; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; }
.queue-list { background: #111; border: 2px solid #ff9800; border-radius: 12px; padding: 1rem; }
.queue-person { display: flex; justify-content: space-between; padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem; background: #222; }
.queue-person.next { background: #ff9800; color: black; font-weight: bold; }
.next-label { font-weight: bold; margin-right: 6px; color: black; }
.purchase { display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #333; }
.pagination { display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; }
.pagination button { padding: 0.3rem 0.6rem; border-radius: 4px; border: none; cursor: pointer; background: #ff9800; color: black; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
