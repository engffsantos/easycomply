import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChecklistPage from './pages/ChecklistPage';
import DocumentosPage from './pages/DocumentosPage';

// Treinamentos
import TreinamentosPage from './pages/TreinamentosPage'; 
import TreinamentoDetalhePage from './pages/TreinamentoDetalhePage';
import TreinamentoFormPage from './pages/TreinamentoFormPage';
import TreinamentoAtribuicaoPage from './pages/TreinamentoAtribuicaoPage';

// Riscos
import RiscosPage from './pages/RiscosPage';
import RiscoDetalhePage from './pages/RiscoDetalhePage';
import RiscoFormPage from './pages/RiscoFormPage';
import AvaliacaoRiscoFormPage from './pages/AvaliacaoRiscoFormPage';
import PlanoTratamentoFormPage from './pages/PlanoTratamentoFormPage';
import RiscoDashboardPage from './pages/RiscoDashboardPage';

import './App.css';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para rotas de Admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated() || !user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rotas Protegidas Comuns */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checklists" 
                element={
                  <ProtectedRoute>
                    <ChecklistPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documentos" 
                element={
                  <ProtectedRoute>
                    <DocumentosPage />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas do Módulo de Treinamentos */}
              <Route 
                path="/treinamentos" 
                element={
                  <ProtectedRoute>
                    <TreinamentosPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/treinamentos/:id" 
                element={
                  <ProtectedRoute>
                    <TreinamentoDetalhePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/treinamentos/novo" 
                element={
                  <AdminRoute>
                    <TreinamentoFormPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/treinamentos/:id/editar" 
                element={
                  <AdminRoute>
                    <TreinamentoFormPage />
                  </AdminRoute>
                } 
              />
               <Route 
                path="/admin/treinamentos/:id/atribuir" 
                element={
                  <AdminRoute>
                    <TreinamentoAtribuicaoPage />
                  </AdminRoute>
                } 
              />

              {/* Rotas do Módulo de Riscos */}
              <Route 
                path="/riscos" 
                element={
                  <ProtectedRoute>
                    <RiscosPage />
                  </ProtectedRoute>
                } 
              />
               <Route 
                path="/riscos/dashboard" 
                element={
                  <ProtectedRoute>
                    <RiscoDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/riscos/novo" 
                element={
                  <ProtectedRoute> {/* Permitir que usuários identifiquem riscos? Ou AdminRoute? */}
                    <RiscoFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/riscos/:id" 
                element={
                  <ProtectedRoute>
                    <RiscoDetalhePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/riscos/:id/editar" 
                element={
                  <AdminRoute> {/* Apenas admin edita? */}
                    <RiscoFormPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/riscos/:id/avaliar" 
                element={
                  <ProtectedRoute> {/* Quem pode avaliar? */}
                    <AvaliacaoRiscoFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/riscos/:id/tratar" 
                element={
                  <ProtectedRoute> {/* Quem pode adicionar plano? */}
                    <PlanoTratamentoFormPage />
                  </ProtectedRoute>
                } 
              />
              {/* Rota para editar plano de tratamento (precisa de planoId) */}
              <Route 
                path="/riscos/:id/tratar/:planoId/editar" 
                element={
                  <ProtectedRoute> {/* Quem pode editar plano? */}
                    <PlanoTratamentoFormPage />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} /> 
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

