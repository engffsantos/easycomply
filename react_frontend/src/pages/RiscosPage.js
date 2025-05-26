// app/react_frontend/src/pages/RiscosPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

// Componente para linha da tabela de Riscos
const RiscoRow = ({ risco }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'identificado': return { backgroundColor: '#cfe2ff', color: '#0a3678' };
      case 'analisado': return { backgroundColor: '#fff3cd', color: '#664d03' };
      case 'avaliado': return { backgroundColor: '#f8d7da', color: '#58151c' };
      case 'em_tratamento': return { backgroundColor: '#d1ecf1', color: '#0c5460' };
      case 'mitigado': return { backgroundColor: '#d4edda', color: '#155724' };
      case 'aceito': return { backgroundColor: '#e2e3e5', color: '#383d41' };
      case 'fechado': return { backgroundColor: '#d6d8db', color: '#1b1e21' };
      default: return { backgroundColor: '#f8f9fa', color: '#212529' };
    }
  };

  const statusText = risco.status ? risco.status.replace('_', ' ').toUpperCase() : 'N/A';
  const statusStyle = getStatusStyle(risco.status);

  return (
    <tr style={{ borderBottom: '1px solid #eee' }}>
      <td style={{ padding: '12px 15px' }}>
        <Link to={`/riscos/${risco.id}`}>{risco.nome}</Link>
      </td>
      <td style={{ padding: '12px 15px' }}>{risco.categoria || '-'}</td>
      <td style={{ padding: '12px 15px' }}>
        <span style={{
          ...statusStyle,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          {statusText}
        </span>
      </td>
      <td style={{ padding: '12px 15px' }}>{risco.data_identificacao ? new Date(risco.data_identificacao).toLocaleDateString('pt-BR') : '-'}</td>
      <td style={{ padding: '12px 15px' }}>
        <Link to={`/riscos/${risco.id}`} className="btn btn-sm btn-outline-primary">Detalhes</Link>
      </td>
    </tr>
  );
};

const RiscosPage = () => {
  const [riscos, setRiscos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ categoria: '', status: '' });
  const [categorias, setCategorias] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const { user } = useContext(AuthContext);

  // Buscar Riscos
  const fetchRiscos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.categoria) queryParams.append('categoria', filters.categoria);
      if (filters.status) queryParams.append('status', filters.status);

      // Em produção: fetch(`/api/riscos?${queryParams}`)
      // const response = await fetch(...);
      // const data = await response.json();
      // if (data.success) {
      //   setRiscos(data.data);
      //   // Extrair categorias e status únicos para filtros
      //   const uniqueCategorias = [...new Set(data.data.map(r => r.categoria).filter(Boolean))];
      //   const uniqueStatuses = [...new Set(data.data.map(r => r.status).filter(Boolean))];
      //   setCategorias(uniqueCategorias);
      //   setStatuses(uniqueStatuses);
      // } else {
      //   setError(data.message || 'Erro ao buscar riscos');
      // }

      // Simulação
      const mockRiscos = [
        { id: 1, nome: "Vazamento de dados de clientes", categoria: "Privacidade", status: "avaliado", data_identificacao: "2025-04-10T10:00:00Z" },
        { id: 2, nome: "Acesso não autorizado a sistemas internos", categoria: "Segurança", status: "em_tratamento", data_identificacao: "2025-03-15T14:30:00Z" },
        { id: 3, nome: "Não conformidade com política de retenção", categoria: "Conformidade", status: "identificado", data_identificacao: "2025-05-20T09:00:00Z" },
        { id: 4, nome: "Falha na anonimização de dados para análise", categoria: "Privacidade", status: "mitigado", data_identificacao: "2025-02-01T11:00:00Z" },
        { id: 5, nome: "Incidente de segurança com fornecedor", categoria: "Terceiros", status: "aceito", data_identificacao: "2025-04-25T16:00:00Z" },
      ];
      
      setTimeout(() => {
        let filtered = [...mockRiscos];
        if (filters.categoria) {
          filtered = filtered.filter(r => r.categoria === filters.categoria);
        }
        if (filters.status) {
          filtered = filtered.filter(r => r.status === filters.status);
        }
        setRiscos(filtered);
        const uniqueCategorias = [...new Set(mockRiscos.map(r => r.categoria).filter(Boolean))];
        const uniqueStatuses = [...new Set(mockRiscos.map(r => r.status).filter(Boolean))];
        setCategorias(uniqueCategorias);
        setStatuses(uniqueStatuses);
        setLoading(false);
      }, 800);

    } catch (err) {
      console.error('Erro ao buscar riscos:', err);
      setError('Não foi possível carregar os riscos. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiscos();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="riscos-page">
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
            <h1>Gestão de Riscos</h1>
            <Link 
              to="/riscos/novo" 
              className="btn btn-success"
            >
              Identificar Novo Risco
            </Link>
          </div>

          {/* Filtros */}
          <div style={{ 
            marginBottom: "2rem", 
            padding: "15px", 
            backgroundColor: "#fff", 
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            display: 'flex',
            gap: '15px'
          }}>
            <div>
              <label htmlFor="categoriaFilter" style={{ display: "block", marginBottom: "5px", fontSize: '0.9rem' }}>Categoria:</label>
              <select 
                id="categoriaFilter"
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minWidth: "150px" }}
              >
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="statusFilter" style={{ display: "block", marginBottom: "5px", fontSize: '0.9rem' }}>Status:</label>
              <select 
                id="statusFilter"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minWidth: "150px" }}
              >
                <option value="">Todos</option>
                {statuses.map(stat => (
                  <option key={stat} value={stat}>{stat.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
             <button 
                onClick={() => setFilters({ categoria: '', status: '' })}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  alignSelf: 'flex-end'
                }}
              >
                Limpar Filtros
              </button>
          </div>

          {/* Tabela de Riscos */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando riscos...</p>
            ) : error ? (
              <p style={{ color: 'red', padding: '2rem' }}>{error}</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Nome do Risco</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Categoria</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Data Identificação</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {riscos.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum risco encontrado.</td>
                    </tr>
                  ) : (
                    riscos.map(risco => (
                      <RiscoRow key={risco.id} risco={risco} />
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RiscosPage;

