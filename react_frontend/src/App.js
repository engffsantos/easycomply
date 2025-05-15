import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Importar Contextos
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Importar Páginas
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ChecklistPage from "./pages/ChecklistPage";
import TreinamentoPage from "./pages/TreinamentoPage";

// Componente para Rotas Protegidas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function AppContent() {
  // const { theme } = useTheme(); // Exemplo de como usar o tema se necessário no AppContent
  return (
    // <div className={`app-container ${theme}`}> {/* Exemplo de aplicação de classe de tema */}
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute><DashboardPage /></PrivateRoute>} 
        />
        <Route 
          path="/checklists" 
          element={<PrivateRoute><ChecklistPage /></PrivateRoute>} 
        />
        <Route 
          path="/treinamentos" 
          element={<PrivateRoute><TreinamentoPage /></PrivateRoute>} 
        />
        {/* Rota padrão, redireciona para o dashboard se autenticado, senão para login */}
        <Route 
          path="*" 
          element={
            <PrivateRoute>
              <Navigate to="/dashboard" />
            </PrivateRoute>
          } 
        />
         <Route path="/" element={<Navigate to="/login" />} /> {/* Rota raiz inicial */} 
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

