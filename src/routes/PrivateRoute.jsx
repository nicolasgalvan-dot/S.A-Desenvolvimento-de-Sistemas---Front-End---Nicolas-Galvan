import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * PrivateRoute.jsx — Componente de proteção de rotas.
 *
 * Como funciona:
 *  1. Aguarda o carregamento inicial do AuthContext (verificação do localStorage).
 *     Durante esse tempo exibe uma mensagem de "Carregando..." para evitar
 *     redirecionamentos incorretos antes da sessão ser restaurada.
 *
 *  2. Se o usuário estiver autenticado (isAuthenticated === true), renderiza
 *     normalmente o componente filho (children).
 *
 *  3. Se não estiver autenticado, redireciona automaticamente para /login.
 *     O prop "replace" evita que /dashboard fique no histórico do navegador,
 *     impedindo que o botão "voltar" leve o usuário para a rota protegida.
 *
 * Uso em App.jsx:
 *  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
 *
 * @param {{ children: React.ReactNode }} props
 */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Aguarda a verificação da sessão salva antes de decidir o redirecionamento
  if (loading) {
    return <p>Carregando...</p>
  }

  // Usuário autenticado → acessa a rota protegida
  if (isAuthenticated) {
    return children
  }

  // Não autenticado → redireciona para login
  return <Navigate to="/login" replace />
}

export default PrivateRoute
