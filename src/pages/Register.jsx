import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

/**
 * Register.jsx — Página de cadastro do FinTech Flow.
 *
 * Responsabilidades:
 *  - Coleta nome, email e senha do novo usuário.
 *  - Realiza validações simples antes de chamar a API.
 *  - Chama POST /auth/register via api.js (Axios).
 *  - Exibe estado de loading durante a requisição.
 *  - Exibe mensagens de erro retornadas pelo backend.
 *  - Em caso de sucesso: redireciona para /login com mensagem de confirmação.
 *
 * Estados:
 *  name        → valor do campo nome
 *  email       → valor do campo e-mail
 *  password    → valor do campo senha
 *  error       → mensagem de erro exibida ao usuário
 *  success     → mensagem de sucesso após cadastro
 *  isLoading   → controla o estado do botão durante a requisição
 *
 * Fluxo de cadastro:
 *  handleSubmit → validação → api.post('/auth/register') → navigate('/login')
 *                                       ↓ (em caso de erro)
 *                               setError(mensagem do backend ou fallback)
 *
 * Futura integração com backend:
 *  O backend deverá expor: POST /auth/register
 *  Receberá: { name, email, password }
 *  Retornará (201): { message: "Cadastro realizado com sucesso." }
 *  Retornará (409): { message: "E-mail já cadastrado." }
 *  Retornará (422): { message: "Dados inválidos." }
 */
function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  /**
   * handleSubmit — função assíncrona que processa o envio do formulário.
   *
   * Etapas:
   *  1. Previne reload da página.
   *  2. Limpa erros e mensagens anteriores.
   *  3. Valida campos localmente.
   *  4. Ativa o estado de loading.
   *  5. Chama POST /auth/register via Axios.
   *  6. Em sucesso: exibe mensagem e redireciona para /login após 1,5s.
   *  7. Em erro: exibe mensagem do backend ou fallback.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // ─── VALIDAÇÕES SIMPLES ─────────────────────────────────────────────────
    if (!name.trim()) {
      setError('Por favor, informe o seu nome.')
      return
    }

    if (!email.trim()) {
      setError('Por favor, informe o e-mail.')
      return
    }

    // Validação básica de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Informe um e-mail válido.')
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
      /**
       * Quando o backend estiver pronto, esta chamada enviará:
       * POST /auth/register
       * Body: { name, email, password }
       *
       * O backend será responsável por:
       *  - Validar os dados recebidos
       *  - Verificar se o e-mail já existe (retornar 409 se sim)
       *  - Criptografar a senha (ex: bcrypt)
       *  - Salvar o usuário no banco de dados
       *  - Retornar 201 com { message: "Cadastro realizado com sucesso." }
       */
      await api.post('/auth/register', { name, email, password })

      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...')

      // Redireciona para /login após 1,5 segundos
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1500)
    } catch (err) {
      /**
       * Hierarquia de mensagens de erro:
       *  1. Mensagem específica do backend (err.response.data.message)
       *     Exemplos esperados do backend:
       *       409 → "E-mail já cadastrado."
       *       422 → "Dados inválidos."
       *  2. Mensagem HTTP genérica (err.response.statusText)
       *  3. Fallback padrão
       */
      const backendMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        'Erro ao realizar o cadastro. Tente novamente.'

      setError(backendMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>FinTech Flow</h1>
      <h2>Criar conta</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Nome</label>
          <br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            disabled={isLoading}
            autoComplete="name"
            autoFocus
          />
        </div>

        <br />

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
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>

        <br />

        {/* Mensagem de erro */}
        {error && (
          <p role="alert" style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {/* Mensagem de sucesso */}
        {success && (
          <p role="status" style={{ color: 'green' }}>
            {success}
          </p>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <br />

      {/* Navegação para login */}
      <p>
        Já tem uma conta?{' '}
        <Link to="/login">Voltar para o login</Link>
      </p>
    </div>
  )
}

export default Register
