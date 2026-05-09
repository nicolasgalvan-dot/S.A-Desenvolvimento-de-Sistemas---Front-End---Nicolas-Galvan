import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Dashboard.jsx — Área protegida da aplicação FinTech Flow.
 *
 * Esta página só é acessível através do PrivateRoute.
 * Qualquer tentativa de acesso direto sem autenticação resultará
 * em redirecionamento automático para /login.
 *
 * Atualmente expõe:
 *  - Dados do usuário autenticado (vindos do AuthContext/localStorage).
 *  - Botão de logout.
 *
 * Expansão futura:
 *  - Aqui serão adicionados os módulos do sistema de tesouraria:
 *    contas a pagar, receber, fluxo de caixa, relatórios, etc.
 *  - Cada módulo fará suas próprias chamadas via api.js.
 */
function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  /**
   * handleLogout — limpa a sessão e redireciona para /login.
   */
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <h1>Dashboard — FinTech Flow</h1>

      <p>
        Bem-vindo(a), <strong>{user?.name || user?.email || 'Usuário'}</strong>!
      </p>

      <hr />

      <section>
        <h2>Dados da sessão</h2>
        <p><strong>E-mail:</strong> {user?.email}</p>
        <p><strong>Perfil:</strong> {user?.role || 'N/A'}</p>
        <p><strong>ID:</strong> {user?.id || 'N/A'}</p>
      </section>

      <hr />

      <section>
        <h2>Módulos do sistema</h2>
        <p>[ Área reservada para os módulos de tesouraria ]</p>
        {/* 
          Futuramente aqui serão inseridos os componentes de:
          - Contas a Pagar
          - Contas a Receber
          - Fluxo de Caixa
          - Relatórios Financeiros
          - etc.
        */}
      </section>

      <hr />

      <button onClick={handleLogout}>Sair</button>
    </div>
  )
}

export default Dashboard
