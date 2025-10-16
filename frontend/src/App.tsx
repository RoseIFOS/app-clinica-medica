import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Pacientes } from './pages/Pacientes'
import { Agenda } from './pages/Agenda'
import { Prontuarios } from './pages/Prontuarios'
import { Financeiro } from './pages/Financeiro'
import { Configuracoes } from './pages/Configuracoes'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pacientes" element={<Pacientes />} />
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/prontuarios" element={<Prontuarios />} />
                    <Route path="/financeiro" element={<Financeiro />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
