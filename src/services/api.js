import axios from 'axios'

/**
 * api.js — Instância configurada do Axios para comunicação com o backend.
 *
 * Configurações:
 *  - baseURL: lida da variável de ambiente VITE_API_URL (definida no .env).
 *  - timeout: 10 segundos — evita que requisições fiquem penduradas indefinidamente.
 *  - Content-Type: application/json — padrão REST.
 *
 * Interceptors:
 *  - Request: injeta automaticamente o token JWT no header Authorization
 *    sempre que ele existir no localStorage. Isso garante que TODAS as
 *    requisições autenticadas já enviem o token sem precisar fazer isso manualmente.
 *
 *  - Response: trata erros globais de autenticação (401 Unauthorized).
 *    Quando o backend retornar 401, o frontend limpa o localStorage e
 *    redireciona o usuário para /login automaticamente.
 *
 * Como usar:
 *  import api from '../services/api'
 *  const response = await api.post('/auth/login', { email, password })
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── INTERCEPTOR DE REQUISIÇÃO ─────────────────────────────────────────────
// Injeta o token JWT em cada requisição, se disponível no localStorage.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── INTERCEPTOR DE RESPOSTA ────────────────────────────────────────────────
// Trata erros globalmente.
// 401: token expirado ou inválido → limpa estado e redireciona para /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
