// app/react_frontend/src/pages/RiscoDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MatrizRisco from '../components/MatrizRisco'; // Importar a Matriz
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

// Componente simples para exibir contagem por status
const StatusCounter = ({ status, count }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'identificado': return { borderLeft: '5px solid #0a3678', backgroundColor: '#cfe2ff' };
      case 'analisado': return { borderLeft: '5px solid #664d03', backgroundColor: '#fff3cd' };
      case 'avaliado': return { borderLeft: '5px solid #58151c', backgroundColor: '#f8d7da' };
      case 'em_tratamento': return { borderLeft: '5px solid #0c5460', backgroundColor: '#d1ecf1' };
      case 'mitigado': return { borderLeft: '5px solid #155724', backgroundColor: '#d4edda' };
      case 'aceito': return { borderLeft: '5px solid #383d41', backgroundColor: '#e2e3e5' };
      case 'fechado': return { borderLeft: '5px solid #1b1e21', backgroundColor: '#d6d8db' };
      default: return { borderLeft: '5px solid #6c757d', backgroundColor: '#f8f9fa' };
    }
  };
  const style = getStatusStyle(status);
  const statusText = status ? status.replace('_', ' ').toUpperCase() : 'N/A';

  return (
    <div style={{
      ...style,
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '10px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'block' }}>{count}</span>
      <span style={{ fontSize: '0.9rem', color: style.color || '#212529' }}>{statusText}</span>
    </div>
  );
};

const RiscoDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({ total_riscos: 0, riscos_por_status: {}, matriz_data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Em produção: fetch('/api/riscos/dashboard')
        // const response = await fetch('/api/riscos/dashboard');
        // const data = await response.json();
        // if (data.success) {
        //   setDashboardData(data.data);
        // } else {
        //   setError(data.message || 'Erro ao buscar dados do dashboard.');
        // }

        // Simulação
        const mockDashboard = {
          total_riscos: 5,
          riscos_por_status: {
            avaliado: 1,
            em_tratamento: 1,
            identificado: 1,
            mitigado: 1,
            aceito: 1
          },
          matriz_data: [
            { id: 1, nome: "Vazamento", probabilidade: 4, impacto: 5, nivel_inerente: 20, probabilidade_residual: 3, impacto_residual: 4, nivel_residual: 12 },
            { id: 2, nome: "Acesso Indevido", probabilidade: 3, impacto: 4, nivel_inerente: 12, probabilidade_residual: 2, impacto_residual: 4, nivel_residual: 8 },
            { id: 3, nome: "Retenção", probabilidade: 2, impacto: 3, nivel_inerente: 6, probabilidade_residual: null, impacto_residual: null, nivel_residual: null }, // Sem avaliação ainda
            { id: 4, nome: "Anonimização", probabilidade: 2, impacto: 2, nivel_inerente: 4, probabilidade_residual: 1, impacto_residual: 1, nivel_residual: 1 },
            { id: 5, nome: "Fornecedor", probabilidade: 3, impacto: 3, nivel_inerente: 9, probabilidade_residual: 3, impacto_residual: 3, nivel_residual: 9 }, // Risco aceito
          ]
        };
        setTimeout(() => {
          setDashboardData(mockDashboard);
          setLoading(false);
        }, 700);

      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError('Não foi possível carregar o dashboard. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="risco-dashboard-page">
      <Navbar />
      <div style={{ display: "flex", paddingTop: "60px" }}>
        <Sidebar />
        <main style={{
          flexGrow: 1,
          padding: "2rem",
          marginLeft: "270px",
          backgroundColor: "#f4f7f6"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1>Dashboard de Riscos</h1>
            <Link to="/riscos" className="btn btn-outline-secondary">Ver Lista de Riscos</Link>
          </div>

          {loading ? (
            <p>Carregando dashboard...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <div>
              {/* Contadores por Status */}
              <div style={{ marginBottom: '2rem' }}>
                <h4>Riscos por Status (Total: {dashboardData.total_riscos})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
                  {Object.entries(dashboardData.riscos_por_status).map(([status, count]) => (
                    <StatusCounter key={status} status={status} count={count} />
                  ))}
                  {/* Adicionar contadores para status não presentes se necessário */}
                </div>
              </div>

              {/* Matrizes de Risco */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                 <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <MatrizRisco data={dashboardData.matriz_data} tipo="inerente" />
                 </div>
                 <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <MatrizRisco data={dashboardData.matriz_data} tipo="residual" />
                 </div>
              </div>

              {/* Outros Widgets (Ex: Riscos Críticos Pendentes, etc.) */}
              {/* ... adicionar mais visualizações conforme necessário ... */}

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RiscoDashboardPage;

