import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Agenda from "./pages/Agenda";
import Prontuarios from "./pages/Prontuarios";
import Financeiro from "./pages/Financeiro";
import Lembretes from "./pages/Lembretes";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/pacientes" element={
              <ProtectedRoute>
                <Pacientes />
              </ProtectedRoute>
            } />
            <Route path="/agenda" element={
              <ProtectedRoute>
                <Agenda />
              </ProtectedRoute>
            } />
            <Route path="/prontuarios" element={
              <ProtectedRoute roles={['admin', 'medico']}>
                <Prontuarios />
              </ProtectedRoute>
            } />
            <Route path="/financeiro" element={
              <ProtectedRoute roles={['admin', 'recepcionista']}>
                <Financeiro />
              </ProtectedRoute>
            } />
            <Route path="/lembretes" element={
              <ProtectedRoute roles={['admin', 'recepcionista']}>
                <Lembretes />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute roles={['admin']}>
                <Configuracoes />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
