<template>
  <div class="home-container">
    <div class="home-card">
      <!-- Header -->
      <header class="home-header">
        <div class="title-section">
          <h1>Fila do Café</h1>
          <p>Gerenciamento de compras de café e filtro</p>
        </div>
        <div class="user-section">
          <div>
            <span>{{ currentUser.name }}</span>
            <span v-if="currentUser.isAdmin" class="admin-badge">ADMIN</span>
            <p class="user-email">{{ currentUser.email }}</p>
          </div>
          <button @click="handleLogout" title="Sair">
            Sair
          </button>
        </div>
      </header>

      <!-- Tabs -->
      <div class="tabs">
        <button
          :class="{ active: activeTab === 'queue' }"
          @click="activeTab = 'queue'"
        >Fila</button>
        <button
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >Histórico</button>
      </div>

      <!-- Content -->
      <div class="tab-content">
        <!-- Fila -->
        <div v-if="activeTab === 'queue'">
          <div class="join-queue">
            <h2>{{ isInQueue ? 'Você está na fila' : 'Entrar na Fila' }}</h2>
            <div v-if="!isInQueue" class="inputs">
              <div>
                <label>Café</label>
                <input type="number" min="1" v-model.number="coffeeQuantity" />
              </div>
              <div>
                <label>Filtro</label>
                <input type="number" min="0" v-model.number="filterQuantity" />
              </div>
            </div>
            <button @click="toggleQueue" :class="isInQueue ? 'leave' : 'enter'">
              {{ isInQueue ? 'Sair da Fila' : 'Entrar na Fila' }}
            </button>
          </div>

          <!-- Lista da Fila -->
          <div class="queue-list">
            <h3>Fila de Compras ({{ queue.length }})</h3>
            <div v-if="queue.length === 0" class="empty-queue">
              Fila vazia - Seja o primeiro!
            </div>
            <div v-else>
              <div
                v-for="(person, index) in queue"
                :key="person.id"
                :class="['queue-person', index === 0 ? 'next' : '']"
              >
                <div class="person-info">
                  <span v-if="index === 0" class="next-label">PRÓXIMO</span>
                  <span>{{ person.name }}</span>
                  <span v-if="person.userId === currentUser.id" class="you-label">VOCÊ</span>
                  <div class="quantities">
                    <span>Café: {{ person.coffeeQuantity }}</span>
                    <span v-if="person.filterQuantity > 0">Filtro: {{ person.filterQuantity }}</span>
                  </div>
                </div>
                <div class="actions">
                  <button v-if="person.userId === currentUser.id" @click="startEditing(person)">Editar</button>
                  <button @click="markAsPurchased(person.id)">Comprar</button>
                  <button v-if="currentUser.isAdmin" @click="removeFromQueue(person.id)">Remover</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Histórico -->
        <div v-else>
          <h2>Histórico de Compras</h2>
          <div v-if="purchases.length === 0" class="empty-history">
            Nenhuma compra registrada ainda
          </div>
          <div v-else>
            <div v-for="purchase in purchases" :key="purchase.id" class="purchase">
              <span>{{ purchase.personName }}</span>
              <span>Café: {{ purchase.coffeeQuantity }}</span>
              <span v-if="purchase.filterQuantity > 0">Filtro: {{ purchase.filterQuantity }}</span>
              <span>{{ formatDate(purchase.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface QueuePerson {
  id: string;
  userId: string;
  name: string;
  coffeeQuantity: number;
  filterQuantity: number;
  addedAt: number;
}

interface Purchase {
  id: string;
  personName: string;
  coffeeQuantity: number;
  filterQuantity: number;
  date: number;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const queue = ref<QueuePerson[]>([]);
const purchases = ref<Purchase[]>([]);
const currentUser = ref<UserSession>(JSON.parse(localStorage.getItem('user')!));
const coffeeQuantity = ref(1);
const filterQuantity = ref(0);
const isInQueue = ref(false);
const activeTab = ref<'queue' | 'history'>('queue');
const editingId = ref<string | null>(null);
const editCoffee = ref(1);
const editFilter = ref(0);

onMounted(() => {
  const savedQueue = localStorage.getItem('coffeeQueue');
  const savedPurchases = localStorage.getItem('purchases');

  if (savedQueue) queue.value = JSON.parse(savedQueue);
  if (savedPurchases) purchases.value = JSON.parse(savedPurchases);

  checkInQueue();
});

function checkInQueue() {
  isInQueue.value = queue.value.some(p => p.userId === currentUser.value.id);
}

function saveQueue() {
  localStorage.setItem('coffeeQueue', JSON.stringify(queue.value));
}

function savePurchases() {
  localStorage.setItem('purchases', JSON.stringify(purchases.value));
}

function handleLogout() {
  queue.value = queue.value.filter(p => p.userId !== currentUser.value.id);
  currentUser.value = { id: '', name: '', email: '', isAdmin: false };
  localStorage.removeItem('user');
  window.location.href = '/login';
}

function toggleQueue() {
  const existing = queue.value.find(p => p.userId === currentUser.value.id);
  if (existing) {
    queue.value = queue.value.filter(p => p.userId !== currentUser.value.id);
  } else {
    queue.value.push({
      id: Date.now().toString(),
      userId: currentUser.value.id,
      name: currentUser.value.name,
      coffeeQuantity: coffeeQuantity.value,
      filterQuantity: filterQuantity.value,
      addedAt: Date.now()
    });
  }
  checkInQueue();
  saveQueue();
}

function startEditing(person: QueuePerson) {
  editingId.value = person.id;
  editCoffee.value = person.coffeeQuantity;
  editFilter.value = person.filterQuantity;
}

function markAsPurchased(personId: string) {
  const person = queue.value.find(p => p.id === personId);
  if (!person) return;

  purchases.value.unshift({
    id: Date.now().toString(),
    personName: person.name,
    coffeeQuantity: person.coffeeQuantity,
    filterQuantity: person.filterQuantity,
    date: Date.now()
  });

  queue.value = queue.value.filter(p => p.id !== personId);
  saveQueue();
  savePurchases();
}

function removeFromQueue(personId: string) {
  queue.value = queue.value.filter(p => p.id !== personId);
  saveQueue();
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
</script>

<style scoped>
.home-container {
  max-width: 900px;
  margin: 2rem auto;
}

.home-card {
  background: #000;
  border: 2px solid #ff9800;
  border-radius: 16px;
  overflow: hidden;
}

.home-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #ff9800, #f57c00);
  color: black;
}

.title-section h1 {
  font-size: 1.8rem;
  margin-bottom: 0.3rem;
}

.user-section {
  text-align: right;
}

.admin-badge {
  background: red;
  color: white;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  margin-left: 5px;
}

.user-email {
  font-size: 0.8rem;
  opacity: 0.8;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #ff9800;
}

.tabs button {
  flex: 1;
  padding: 0.8rem;
  background: #000;
  color: #ff9800;
  border: none;
  cursor: pointer;
}

.tabs button.active {
  background: #ff9800;
  color: black;
}

.tab-content {
  padding: 1.5rem;
  color: white;
}

.join-queue {
  background: #111;
  border: 2px solid #ff9800;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
}

.join-queue input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ff9800;
  background: #222;
  color: white;
}

.join-queue button.enter {
  background: #ff9800;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.join-queue button.leave {
  background: red;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.queue-list {
  background: #111;
  border: 2px solid #ff9800;
  border-radius: 12px;
  padding: 1rem;
}

.queue-person {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: #222;
}

.queue-person.next {
  background: #ff9800;
  color: black;
}

.next-label {
  font-weight: bold;
}

.you-label {
  background: #2196f3;
  color: white;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.actions button {
  margin-left: 0.3rem;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: #555;
  color: white;
}

.actions button:hover {
  background: #777;
}

.purchase {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #333;
}
</style>
