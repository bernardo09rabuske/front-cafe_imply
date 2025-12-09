import axios from 'axios'

export interface Compra {
  id: number
  usuario_id: number
  fila_id: number
  cafe_qtd: number
  filtro_qtd: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  usuario?: {
    id: number
    nome: string
    [key: string]: any
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/compras'

const compraService = {
  listar: async (): Promise<ApiResponse<Compra[]>> => {
    const res = await axios.get(`${API_URL}`)
    return res.data  // aqui res.data é { message?, data: Compra[] }
  },

  buscar: async (usuarioId: number): Promise<ApiResponse<Compra[]>> => {
    const res = await axios.get(`${API_URL}/usuario/${usuarioId}`)
    return res.data
  },

  adicionar: async (payload: Partial<Compra>): Promise<ApiResponse<Compra>> => {
    const res = await axios.post(`${API_URL}`, payload)
    return res.data
  },

  atualizar: async (id: number, payload: Partial<Compra>): Promise<{ data: Compra }> => {
    const res = await axios.put(`${API_URL}/${id}`, payload)
    return res.data
  },

  excluir: async (id: number): Promise<{ message: string }> => {
    const res = await axios.delete(`${API_URL}/${id}`)
    return res.data
  },

  restaurar: async (id: number, alterado_por?: number): Promise<{ data: Compra }> => {
    const res = await axios.post(`${API_URL}/restaurar/${id}`, { alterado_por })
    return res.data
  },

  cancelar: async (id: number): Promise<{ message: string; compra: Compra }> => {
    const res = await axios.post(`${API_URL}/cancelar/${id}`)
    return res.data
  }
}

// Exportando o serviço como default
export default compraService
export interface ApiResponse<T> {
  message?: string
  data: T
}

