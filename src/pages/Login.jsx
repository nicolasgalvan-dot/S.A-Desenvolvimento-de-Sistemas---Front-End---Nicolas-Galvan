import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Login.jsx — Página de autenticação do FinTech Flow.
 *
 * Responsabilidades:
 *  - Coleta email e senha do usuário.
 *  - Realiza validação simples antes de chamar a API.
 *  - Chama auth.login() do AuthContext, que por sua vez comunica com o backend.
 *  - Exibe estado de loading durante a requisição.
 *  - Exibe mensagem de erro caso a autenticação falhe.
 *  - Redireciona para /dashboard após login bem-sucedido.
 *
 * Estados:
 *  email       → valor do campo e-mail
 *  password    → valor do campo senha
 *  error       → mensagem de erro exibida ao usuário
 *  isLoading   → controla o estado do botão e feedback visual
 *
 * Fluxo de autenticação:
 *  handleSubmit → validação → auth.login(email, password) → navigate('/dashboard')
 *                                     ↓ (em caso de erro)
 *                              setError(mensagem do backend ou fallback)
 */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  /**
   * handleSubmit — função assíncrona que processa o envio do formulário.
   *
   * Etapas:
   *  1. Previne o comportamento padrão do form (reload da página).
   *  2. Limpa qualquer erro anterior.
   *  3. Valida os campos localmente.
   *  4. Ativa o estado de loading.
   *  5. Chama login() do AuthContext.
   *  6. Em caso de sucesso: redireciona para /dashboard.
   *  7. Em caso de erro: exibe a mensagem retornada pelo backend ou um fallback.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // ─── VALIDAÇÃO SIMPLES ──────────────────────────────────────────────────
    if (!email.trim()) {
      setError('Por favor, informe o e-mail.')
      return
    }

    if (!password.trim()) {
      setError('Por favor, informe a senha.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    // ─── CHAMADA À API ──────────────────────────────────────────────────────
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      /**
       * Hierarquia de mensagens de erro:
       *  1. Mensagem específica do backend (err.response.data.message)
       *  2. Mensagem HTTP genérica (err.response.statusText)
       *  3. Fallback padrão
       *
       * O backend deve retornar:
       *  { "message": "Credenciais inválidas." } com status 401
       */
      const backendMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        'Erro ao realizar login. Tente novamente.'

      setError(backendMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>FinTech Flow</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">E-mail</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            disabled={isLoading}
            autoComplete="email"
            autoFocus
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">Senha</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <br />

        {/* Exibe mensagem de erro */}
        {error && (
          <p role="alert" style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <br />

      {/* Navegação para cadastro */}
      <p>
        Ainda não tem uma conta?{' '}
        <Link to="/register">Criar conta</Link>
      </p>
    </div>
  )
}

export default Login
