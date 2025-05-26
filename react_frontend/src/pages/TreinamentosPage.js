// app/react_frontend/src/pages/TreinamentosPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext'; // Para verificar se é admin
import '../App.css';

// Componente Card para Treinamento
const TreinamentoCard = ({ treinamento, isAdmin }) => {
  const userStatus = treinamento.user_status;
  let statusText = "Não Iniciado";
  let statusColor = "#6c757d"; // Cinza
  let actionButtonText = "Iniciar";
  let actionLink = `/treinamentos/${treinamento.id}`;

  if (userStatus) {
    switch (userStatus.status) {
      case 'em_andamento':
        statusText = "Em Andamento";
        statusColor = "#ffc107"; // Amarelo
        actionButtonText = "Continuar";
        break;
      case 'concluido':
        statusText = "Concluído";
        statusColor = "#28a745"; // Verde
        actionButtonText = "Ver Detalhes";
        break;
      case 'pendente_aprovacao':
        statusText = "Pendente Aprovação";
        statusColor = "#17a2b8"; // Azul claro
        actionButtonText = "Ver Detalhes";
        break;
      default:
        statusText = "Não Iniciado";
        statusColor = "#6c757d";
        actionButtonText = "Iniciar";
    }
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '200px'
    }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{treinamento.titulo}</h3>
        {treinamento.categoria && (
          <span style={{
            backgroundColor: '#e9ecef',
            color: '#495057',
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            display: 'inline-block',
            marginBottom: '0.5rem'
          }}>
            {treinamento.categoria}
          </span>
        )}
        <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '1rem' }}>
          {treinamento.descricao ? `${treinamento.descricao.substring(0, 100)}...` : 'Sem descrição.'}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{
          fontWeight: 'bold',
          color: statusColor,
          border: `1px solid ${statusColor}`,
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '0.85rem'
        }}>
          {statusText}
        </span>
        <div>
          {isAdmin && (
            <Link 
              to={`/admin/treinamentos/${treinamento.id}/editar`} 
              style={{
                marginRight: '10px',
                color: '#ffc107',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Editar
            </Link>
          )}
          <Link 
            to={actionLink} 
            className="btn btn-primary"
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {actionButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

const TreinamentosPage = () => {
  const [treinamentos, setTreinamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ categoria: '', status: '' });
  const [categorias, setCategorias] = useState([]); // Para popular o filtro
  const { user } = useContext(AuthContext);
  const isAdmin = user?.is_admin;

  // Buscar treinamentos
  const fetchTreinamentos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter.categoria) queryParams.append('categoria', filter.categoria);
      // O filtro de status será aplicado no frontend por enquanto, 
      // pois o backend retorna o status do usuário em cada treinamento.
      
      // Em produção, usar fetch real
      // const response = await fetch(`/api/treinamentos?${queryParams}`);
      // const data = await response.json();
      // if (data.success) {
      //   setTreinamentos(data.data);
      //   // Extrair categorias únicas para o filtro
      //   const uniqueCategorias = [...new Set(data.data.map(t => t.categoria).filter(Boolean))];
      //   setCategorias(uniqueCategorias);
      // } else {
      //   setError(data.message || 'Erro ao buscar treinamentos');
      // }

      // Simulação para desenvolvimento
      const mockTreinamentos = [
        {
          id: 1,
          titulo: "Introdução à LGPD",
          descricao: "Conceitos básicos da Lei Geral de Proteção de Dados.",
          categoria: "LGPD Básico",
          ativo: true,
          user_status: { status: "concluido", data_conclusao: new Date().toISOString() }
        },
        {
          id: 2,
          titulo: "Segurança da Informação para Colaboradores",
          descricao: "Práticas essenciais de segurança no dia a dia.",
          categoria: "Segurança",
          ativo: true,
          user_status: { status: "em_andamento", data_inicio: new Date().toISOString() }
        },
        {
          id: 3,
          titulo: "Gestão de Incidentes de Segurança",
          descricao: "Procedimentos para identificar e responder a incidentes.",
          categoria: "Segurança",
          ativo: true,
          user_status: null // Não iniciado
        },
         {
          id: 4,
          titulo: "Direitos dos Titulares de Dados",
          descricao: "Como atender às solicitações dos titulares.",
          categoria: "LGPD Avançado",
          ativo: true,
          user_status: null // Não iniciado
        }
      ];
      
      setTimeout(() => {
        let filtered = [...mockTreinamentos];
        if (filter.categoria) {
          filtered = filtered.filter(t => t.categoria === filter.categoria);
        }
        if (filter.status) {
          filtered = filtered.filter(t => {
            const currentStatus = t.user_status?.status || 'nao_iniciado';
            return currentStatus === filter.status;
          });
        }
        setTreinamentos(filtered);
        const uniqueCategorias = [...new Set(mockTreinamentos.map(t => t.categoria).filter(Boolean))];
        setCategorias(uniqueCategorias);
        setLoading(false);
      }, 800);

    } catch (err) {
      console.error('Erro ao buscar treinamentos:', err);
      setError('Não foi possível carregar os treinamentos. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  // Efeito para buscar treinamentos ao carregar ou quando filtros mudarem
  useEffect(() => {
    fetchTreinamentos();
  }, [filter]);

  return (
    <div className="treinamentos-page">
      <Navbar />
      <div style={{ display: "flex", paddingTop: "60px" }}>
        <Sidebar />
        <main style={{
          flexGrow: 1,
          padding: "2rem",
          marginLeft: "270px", // Ajuste conforme a largura do Sidebar
          backgroundColor: "#f4f7f6"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1>Treinamentos</h1>
            {isAdmin && (
              <Link 
                to="/admin/treinamentos/novo" 
                className="btn btn-success"
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Criar Novo Treinamento
              </Link>
            )}
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
                value={filter.categoria}
                onChange={(e) => setFilter({ ...filter, categoria: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minWidth: "150px" }}
              >
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="statusFilter" style={{ display: "block", marginBottom: "5px", fontSize: '0.9rem' }}>Meu Status:</label>
              <select 
                id="statusFilter"
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minWidth: "150px" }}
              >
                <option value="">Todos</option>
                <option value="nao_iniciado">Não Iniciado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="pendente_aprovacao">Pendente Aprovação</option>
              </select>
            </div>
             <button 
                onClick={() => setFilter({ categoria: '', status: '' })}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  alignSelf: 'flex-end' // Alinha o botão na parte inferior do flex container
                }}
              >
                Limpar Filtros
              </button>
          </div>

          {/* Lista de Treinamentos */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>Carregando treinamentos...</p>
            </div>
          ) : error ? (
            <div style={{ 
              padding: "1rem", 
              backgroundColor: "#f8d7da", 
              color: "#721c24", 
              borderRadius: "4px", 
              marginBottom: "1rem" 
            }}>
              <p>{error}</p>
            </div>
          ) : treinamentos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", backgroundColor: '#fff', borderRadius: '8px' }}>
              <p>Nenhum treinamento encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="treinamentos-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {treinamentos.map(treinamento => (
                <TreinamentoCard key={treinamento.id} treinamento={treinamento} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TreinamentosPage;

