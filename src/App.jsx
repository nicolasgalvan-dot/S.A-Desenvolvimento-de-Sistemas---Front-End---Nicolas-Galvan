import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

/**
 * App.jsx — Componente raiz da aplicação.
 *
 * Responsabilidades:
 *  - Envolve toda a aplicação no AuthProvider (Context API de autenticação).
 *  - Configura o BrowserRouter e define todas as rotas da aplicação.
 *  - Separa rotas públicas (acessíveis sem login) de rotas privadas (requerem autenticação).
 *
 * Estrutura de rotas:
 *  /login      → público  → Login.jsx
 *  /register   → público  → Register.jsx
 *  /dashboard  → privado  → Dashboard.jsx (protegido por PrivateRoute)
 *  /           → redireciona para /login por padrão
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rota privada — exige autenticação */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Qualquer rota desconhecida redireciona para /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
