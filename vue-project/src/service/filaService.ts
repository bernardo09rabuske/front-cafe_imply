import axios from 'axios'

export interface FilaService {
  id: number
  usuario_id: number
  posicao: number
  ativo: boolean
  usuario?: {
    id: number
    nome: string
    [key: string]: any
  }
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/fila'

export const filaService = {
  listar: async (): Promise<{ data: FilaService[] }> => {
    const res = await axios.get(`${API_URL}`)
    return res.data
  },

  buscar: async (id: number): Promise<{ data: FilaService[] }> => {
    const res = await axios.get(`${API_URL}/${id}`)
    return res.data
  },

  adicionar: async (id: number): Promise<{ data: FilaService }> => {
    const res = await axios.post(`${API_URL}/adicionar/${id}`)
    return res.data
  },

  excluir: async (id: number): Promise<{ message: string }> => {
    const res = await axios.delete(`${API_URL}/${id}`)
    return res.data
  },

  restaurar: async (id: number): Promise<{ data: FilaService }> => {
    const res = await axios.post(`${API_URL}/restaurar/${id}`)
    return res.data
  }
}

