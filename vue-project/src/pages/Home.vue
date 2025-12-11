<template>
  <div class="home-container">
    <app-header />

    <div class="main-content">
      <!-- CAIXA DE ENTRAR NA FILA -->
      <div class="caixa-fila">
        <h2>{{ estaNaFila ? 'Você está na fila' : 'Entrar na fila' }}</h2>

        <button v-if="!estaNaFila" @click="entrarNaFila" class="btn-entrar">
          Entrar na fila
        </button>

        <button v-else @click="sairDaFila" class="btn-sair">
          Sair da fila
        </button>
      </div>

      <!-- LISTA DA FILA -->
      <div class="fila-container">
        <h3>Fila Atual ({{ fila.length }})</h3>
        <div v-if="fila.length === 0" class="fila-vazia">Fila vazia — seja o primeiro!</div>

        <div v-else class="fila-lista">
          <div v-for="(item, index) in fila" :key="item.id" class="pessoa-fila">
            <div class="info-pessoa">
              <span class="posicao">{{ index + 1 }}º</span>
              <span>{{ item.usuario.nome }}</span>
            </div>

            <div>
              <span v-if="!minhaVez">Esperando sua vez...</span>
              <span v-else-if="item.usuario.id !== usuarioAtual.id && item.comprado">Aguardando Confirmação</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE COMPRA -->
    <v-dialog v-model="modalCompraAberto" persistent max-width="400">
      <v-card v-if="usuarioAtualCompra">
        <v-card-title>Escolher Quantidade</v-card-title>
        <v-card-text>
          <p>Usuário: <strong>{{ usuarioAtualCompra.usuario.nome }}</strong></p>
          <v-text-field
            v-model.number="qtdCafe"
            label="Café"
            type="number"
            min="1"
          />
          <v-text-field
            v-model.number="qtdFiltro"
            label="Filtro"
            type="number"
            min="0"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="solicitarCompra(usuarioAtualCompra)">
            Comprar
          </v-btn>
          <v-btn color="red" @click="modalCompraAberto = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "../controller/api";

// Interfaces
interface Usuario {
  id: number;
  nome: string;
}

interface FilaItem {
  id: number;
  usuario_id: number;
  usuario: Usuario;
  cafe_qtd?: number;
  filtro_qtd?: number;
  comprado?: boolean;
}

const usuarioAtual = ref<Usuario>(JSON.parse(localStorage.getItem("user")!));

const fila = ref<FilaItem[]>([]);
const estaNaFila = ref(false);
const qtdCafe = ref(1);
const qtdFiltro = ref(0);
const comprando = ref(false);

const modalCompraAberto = ref(false);
const usuarioAtualCompra = ref<FilaItem | null>(null);

const minhaVez = computed(() => {
  return fila.value[0]?.usuario?.id === usuarioAtual.value?.id;
});

async function carregarFila() {
  try {
    const res = await api.get("/fila");
    fila.value = res.data.fila;
    estaNaFila.value = fila.value.some(p => p.usuario.id === usuarioAtual.value.id);

    if (minhaVez.value && fila.value[0]) {
      abrirModalCompra(fila.value[0]);
    }
  } catch (err) {
    console.error("Erro ao carregar fila:", err);
  }
}

async function entrarNaFila() {
  try {
    await api.post("/fila");
    await carregarFila();
  } catch (err) {
    console.error("Erro ao entrar na fila:", err);
  }
}

async function sairDaFila() {
  try {
    await api.delete("/fila");
    await carregarFila();
  } catch (err) {
    console.error("Erro ao sair da fila:", err);
  }
}

function abrirModalCompra(item: FilaItem) {
  usuarioAtualCompra.value = item;
  qtdCafe.value = item.cafe_qtd ?? 1;
  qtdFiltro.value = item.filtro_qtd ?? 0;
  modalCompraAberto.value = true;
}

async function solicitarCompra(item: FilaItem) {
  comprando.value = true;
  try {
    await api.post(`/compras/solicitar/${item.id}`, {
      cafe_qtd: qtdCafe.value,
      filtro_qtd: qtdFiltro.value
    });
    modalCompraAberto.value = false;
    await carregarFila();
  } catch (err) {
    console.error("Erro ao solicitar compra:", err);
  } finally {
    comprando.value = false;
  }
}

onMounted(() => {
  carregarFila();
});
</script>

<style scoped>
.home-container {
  max-width: 1000px;
  margin: 2rem auto;
  color: white;
}

.main-content {
  display: flex;
  gap: 2rem;
}

/* Caixa entrar na fila */
.caixa-fila {
  flex: 1;
  background: #111;
  border: 2px solid #ff9800;
  padding: 1rem;
  border-radius: 12px;
}

.btn-entrar {
  background: #ff9800;
  color: black;
  padding: 0.7rem;
  border-radius: 6px;
  width: 100%;
}

.btn-sair {
  background: red;
  color: white;
  padding: 0.7rem;
  border-radius: 6px;
  width: 100%;
}

/* Fila */
.fila-container {
  flex: 2;
  background: #111;
  border: 2px solid #ff9800;
  border-radius: 12px;
  padding: 1rem;
}

.pessoa-fila {
  background: #222;
  padding: 0.6rem;
  border-radius: 6px;
  margin-bottom: 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  cursor: pointer;
}
</style>
