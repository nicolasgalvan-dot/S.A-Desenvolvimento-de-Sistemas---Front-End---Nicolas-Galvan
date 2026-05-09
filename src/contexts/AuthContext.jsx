import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

/**
 * AuthContext.jsx — Context API de autenticação global.
 *
 * Responsabilidades:
 *  - Centraliza todo o estado de autenticação da aplicação.
 *  - Expõe: { user, token, isAuthenticated, loading, login, logout }.
 *  - Persiste token e dados do usuário no localStorage para manter a
 *    sessão ativa mesmo após recarregar a página (F5).
 *  - Na inicialização, verifica se já existe uma sessão salva e restaura o estado.
 *
 * Uso:
 *  import { useAuth } from '../contexts/AuthContext'
 *  const { user, login, logout, isAuthenticated } = useAuth()
 */

// Cria o contexto
const AuthContext = createContext(null)

// ─── PROVIDER ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // aguarda verificação inicial

  /**
   * Na montagem do componente, verifica se há uma sessão salva no localStorage.
   * Se existir, restaura o estado de autenticação automaticamente.
   * Isso garante que o usuário continue logado após recarregar a página.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
      } catch {
        // JSON corrompido — limpa o localStorage para evitar erros futuros
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setLoading(false)
  }, [])

  /**
   * login()
   *
   * Realiza a chamada à API de autenticação e armazena as credenciais.
   *
   * @param {string} email    - E-mail do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<void>}
   * @throws {Error} - Relança o erro para que o componente de Login possa exibir a mensagem
   *
   * Estrutura esperada da resposta do backend:
   * {
   *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   *   "user": {
   *     "id": 1,
   *     "name": "João Silva",
   *     "email": "joao@exemplo.com",
   *     "role": "admin"
   *   }
   * }
   */
  const login = async (email, password) => {
    // A chamada real à API — endpoint a ser implementado no backend
    const response = await api.post('/auth/login', { email, password })

    const { token: receivedToken, user: receivedUser } = response.data

    // Persiste no localStorage
    localStorage.setItem('token', receivedToken)
    localStorage.setItem('user', JSON.stringify(receivedUser))

    // Atualiza o estado global
    setToken(receivedToken)
    setUser(receivedUser)
  }

  /**
   * logout()
   *
   * Limpa toda a sessão do usuário: estado em memória + localStorage.
   * O componente que chamar logout() deverá redirecionar para /login.
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  // Valor exposto pelo contexto para todos os componentes filhos
  const contextValue = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── HOOK PERSONALIZADO ──────────────────────────────────────────────────────
/**
 * useAuth()
 *
 * Hook personalizado para consumir o AuthContext.
 * Garante que o hook seja usado apenas dentro de um AuthProvider.
 *
 * @returns {{ user, token, isAuthenticated, loading, login, logout }}
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>')
  }

  return context
}

export default AuthContext
